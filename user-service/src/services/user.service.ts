import bcrypt from "bcryptjs";
import User from "../models/user.model";
import UserRole from "../models/user-role.model";
import { generateToken, generateRefreshToken } from "./jwt.service";
import { logger } from "../utils/logger";
import { Op } from "sequelize";
import { publishEvent } from "../events/publisher";
import twilio from "twilio";
import { sendEmail } from "./mail.service";

let twilioClient: any = null;

const getTwilioClient = () => {
  if (twilioClient) return twilioClient;

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    logger.warn("Twilio credentials NOT FOUND in environment variables. SMS will NOT be sent.");
    return null;
  }

  try {
    twilioClient = twilio(sid, token);
    return twilioClient;
  } catch (error) {
    logger.error("Failed to initialize Twilio client", error);
    return null;
  }
};

const APPLE_TEST_NUMBER = "9999999999";
const APPLE_TEST_OTP = "123456";

const sendOtpEmail = async (email: string, otp: string, userName: string) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #007bff; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">FoodScan</h1>
      </div>
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Use the following security code to reset your password. This code is valid for <strong>10 minutes</strong>.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; padding: 20px 40px; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">
            ${otp}
          </div>
        </div>
        
        <p style="color: #999; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; pt: 20px;">
          If you didn't request this, please ignore this email or contact support if you have concerns.
        </p>
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px;">
        &copy; 2026 FoodScan. All rights reserved.
      </div>
    </div>
  `;

  await sendEmail(email, "Your Verification Code - FoodScan", html);
};

export const userService = {

  // ─── REGISTER ────────────────────────────────────────────
  async register(data: any) {
    logger.info("Registering user: checking existing email", { email: data.email });

    const exist = await User.findOne({ where: { email: data.email } });
    if (exist) {
      throw { status: 400, message: "User already exists", code: "USER_EXISTS" };
    }

    if (data.username) {
      const usernameExists = await User.findOne({ where: { username: data.username } });
      if (usernameExists) {
        throw { status: 400, message: "Username already taken", code: "USERNAME_EXISTS" };
      }
    }

    // Validate role
    if (data.role_id) {
      const roleExist = await UserRole.findByPk(data.role_id);
      if (!roleExist) {
        throw { status: 400, message: "Invalid Role ID" };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await User.create({
        ...data,
        password: hashedPassword,
        username: data.username || data.email.split("@")[0],
      });

      try {
        await publishEvent("user_events", "USER_REGISTERED", {
          userId: user.id,
          email: user.email,
          roleId: user.role_id,
          username: user.username,
        });
      } catch (err: any) {
        logger.error("Failed to publish USER_REGISTERED event:", { error: err.message });
      }

      logger.info("User created successfully", { id: user.id });
      const { password: _, ...safeUser } = user.toJSON();
      return safeUser;
    } catch (dbError: any) {
      if (dbError.name === "SequelizeUniqueConstraintError") {
        const message = dbError.errors?.[0]?.message || "Unique constraint violation";
        throw { status: 400, message, code: "VALIDATION_ERROR" };
      }
      throw dbError;
    }
  },

  // ─── LOGIN ───────────────────────────────────────────────
  async login(data: any) {
    const where: any = { status: 1 };

    if (data.email) {
      where.email = data.email;
    } else if (data.username) {
      where.username = data.username;
    } else {
      throw { status: 400, message: "Email or username is required" };
    }

    const user = await User.findOne({ where });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    const match = await bcrypt.compare(data.password, user.password || "");
    if (!match) {
      throw { status: 401, message: "Wrong password" };
    }

    const token = generateToken({ id: user.id, email: user.email, role_id: user.role_id });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role_id: user.role_id });

    const { password: _, ...safeUser } = user.toJSON();
    return { token, refreshToken, user: safeUser };
  },

  // ─── GET ALL USERS ───────────────────────────────────────
  async getAllUsers(query: any) {
    const { role_id, status, search_query, page = 1, limit = 10 } = query;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const andConditions: any[] = [];

    if (role_id) andConditions.push({ role_id: Number(role_id) });
    if (status !== undefined && status !== "") andConditions.push({ status: Number(status) });

    if (search_query) {
      const search = String(search_query).trim();
      andConditions.push({
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { username: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const { count, rows } = await User.findAndCountAll({
      where: andConditions.length > 0 ? { [Op.and]: andConditions } : {},
      include: [{ model: UserRole, as: "role", attributes: ["id", "name"] }],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  },

  // ─── GET USER BY ID ──────────────────────────────────────
  async getUserById(id: string) {
    const user = await User.findByPk(id, {
      include: [{ model: UserRole, as: "role", attributes: ["id", "name"] }],
      attributes: { exclude: ["password"] },
    });
    if (!user) throw { status: 404, message: "User not found" };
    return user;
  },

  // ─── UPDATE USER ─────────────────────────────────────────
  async updateUser(id: string, data: any) {
    const user = await User.findByPk(id);
    if (!user) throw { status: 404, message: "User not found" };

    if (data.role_id) {
      const roleExist = await UserRole.findByPk(data.role_id);
      if (!roleExist) throw { status: 400, message: "Invalid Role ID" };
    }

    await user.update(data);

    try {
      await publishEvent("user_events", "USER_UPDATED", {
        userId: user.id,
      });
    } catch (err: any) {
      logger.error("Failed to publish USER_UPDATED event:", { error: err.message });
    }

    const { password: _, ...updatedUser } = user.toJSON();
    return updatedUser;
  },

  // ─── DELETE USER (SOFT) ──────────────────────────────────
  async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) throw { status: 404, message: "User not found" };
    await user.destroy(); // paranoid: true => sets deletedAt

    try {
      await publishEvent("user_events", "USER_DELETED", {
        userId: user.id,
      });
    } catch (err: any) {
      logger.error("Failed to publish USER_DELETED event:", { error: err.message });
    }
  },

  // ─── CHANGE PASSWORD ────────────────────────────────────
  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;
    const user = await User.findByPk(userId);

    if (!user) throw { status: 404, message: "User not found" };

    const isMatch = await bcrypt.compare(currentPassword, user.password || "");
    if (!isMatch) throw { status: 401, message: "Incorrect current password" };

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { success: true, message: "Password changed successfully" };
  },

  // ─── RESET PASSWORD ─────────────────────────────────────
  async resetPassword(userId: string, data: any) {
    const { newPassword, confirmPassword } = data;

    if (!newPassword || !confirmPassword) {
      throw { status: 400, message: "New password and confirm password are required" };
    }

    if (newPassword !== confirmPassword) {
      throw { status: 400, message: "Passwords do not match" };
    }

    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: "User not found" };

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { success: true, message: "Password reset successful" };
  },

  // ─── PHONE & OTP FLOWS ───────────────────────────────────
  async loginWithPhone(phone: string) {
    let numericPhone = phone.replace(/\D/g, "").slice(-10);

    if (!numericPhone) {
      throw { status: 400, message: "Invalid phone number" };
    }

    let user = await User.findOne({ where: { phone: numericPhone } });
    if (!user) {
      user = await User.findOne({
        where: {
          phone: {
            [Op.like]: `%${numericPhone}`
          }
        }
      });
    }

    if (!user) {
      throw { status: 400, message: "Phone number not registered!" };
    }

    const otp = numericPhone === APPLE_TEST_NUMBER
      ? APPLE_TEST_OTP
      : Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    if (numericPhone !== APPLE_TEST_NUMBER) {
      try {
        const client = getTwilioClient();
        const from = process.env.TWILIO_NUMBER;

        if (client && from) {
          const targetNumber = phone.startsWith("+") ? phone : `+91${numericPhone}`;
          await client.messages.create({
            body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
            from: from,
            to: targetNumber,
          });
          logger.info("OTP SMS sent successfully", { phone: targetNumber });
        } else {
          logger.warn("Development Mode: OTP created but not sent via SMS (Missing Twilio Config)", {
            numericPhone,
            otp
          });
        }
      } catch (twilioError: any) {
        logger.error("Production Error: Twilio SMS failed to send", {
          error: twilioError.message,
          phone: numericPhone,
          otp
        });
      }
    }

    return {
      message: numericPhone === APPLE_TEST_NUMBER ? "OTP sent (TEST ACCOUNT)" : "OTP sent successfully",
      otp: numericPhone === APPLE_TEST_NUMBER ? APPLE_TEST_OTP : otp
    };
  },

  async verifyOtp(data: { phone: string; otp: string; fcmToken?: string }) {
    let numericPhone = data.phone.replace(/\D/g, "").slice(-10);

    let user = await User.findOne({ where: { phone: numericPhone } });
    if (!user) {
      user = await User.findOne({
        where: {
          phone: {
            [Op.like]: `%${numericPhone}`
          }
        }
      });
    }

    if (!user || user.otp !== data.otp.toString()) {
      throw { status: 400, message: "Invalid OTP" };
    }

    if (user.otp_expiry && new Date() > user.otp_expiry) {
      throw { status: 400, message: "OTP has expired" };
    }

    if (data.fcmToken) {
      user.fcm_token = data.fcmToken;
    }

    user.otp = undefined as any;
    user.otp_expiry = undefined as any;
    await user.save();

    const token = generateToken({ id: user.id, email: user.email, role_id: user.role_id });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role_id: user.role_id });

    const userJson = user.toJSON();
    delete (userJson as any).password;
    delete (userJson as any).otp;
    delete (userJson as any).otp_expiry;

    return { token, refreshToken, user: userJson };
  },

  // ─── EMAIL OTP FLOWS ─────────────────────────────────────
  async sendOtpByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 404, message: "User not found with this email" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otp_expiry = otpExpiry;
    await user.save();

    try {
      await sendOtpEmail(email, otp, user.name);
      return { success: true, message: "OTP sent to email" };
    } catch (error) {
      throw { status: 500, message: "Failed to send email" };
    }
  },

  async verifyOtpEmail(data: { email: string; otp: string }) {
    const user = await User.findOne({ where: { email: data.email } });

    if (!user || user.otp !== data.otp.toString()) {
      throw { status: 400, message: "Invalid OTP" };
    }

    if (user.otp_expiry && new Date() > user.otp_expiry) {
      throw { status: 400, message: "OTP has expired" };
    }

    user.otp = undefined as any;
    user.otp_expiry = undefined as any;
    await user.save();

    const token = generateToken({ id: user.id, email: user.email, role_id: user.role_id });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role_id: user.role_id });

    const userJson = user.toJSON();
    delete (userJson as any).password;
    delete (userJson as any).otp;
    delete (userJson as any).otp_expiry;

    return { token, refreshToken, user: userJson };
  },

  async resetPasswordWithEmail(userId: string, data: any) {
    const { newPassword, confirmPassword } = data;

    if (!newPassword || !confirmPassword) {
      throw {
        status: 400,
        message: "New password and confirm password are required",
      };
    }

    if (newPassword !== confirmPassword) {
      throw {
        status: 400,
        message: "Passwords do not match",
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: "User not found",
      };
    }

    user.password = newPassword;
    user.otp = null as any;
    user.otp_expiry = null as any;

    await user.save();

    return {
      success: true,
      message: "Password reset successful",
    };
  },

  // ─── BLACKLISTED USERS ───────────────────────────────────
  // async getBlacklistedUsers() {
  //   return await User.findAll({
  //     where: {
  //       deletedAt: {
  //         [Op.not]: null,
  //       },
  //     },
  //     paranoid: false,
  //     attributes: { exclude: ["password"] },
  //   });
  // },
};
