import bcrypt from "bcryptjs";
import Branch from "../models/branch.model";
import { generateToken, generateRefreshToken } from "./jwt.service";
import { logger } from "../utils/logger";
import { Op } from "sequelize";
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

const sendOtpEmail = async (email: string, otp: string, branchName: string) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #007bff; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">FoodScan Branch Portal</h1>
      </div>
      <div style="padding: 40px; background-color: #ffffff;">
        <h2 style="color: #333; margin-top: 0;">Verification Code</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hello <strong>${branchName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Use the following security code. This code is valid for <strong>10 minutes</strong>.</p>
        
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

export const branchAuthService = {

  // ─── LOGIN ───────────────────────────────────────────────
  async login(data: any) {
    const where: any = { status: 1 };

    if (data.email) {
      where.email = data.email;
    } else if (data.phone) {
      where.phone = data.phone;
    } else {
      throw { status: 400, message: "Email or phone is required for login" };
    }

    const branch = await Branch.findOne({ where });
    if (!branch) {
      throw { status: 404, message: "Branch not found or inactive" };
    }

    const match = await bcrypt.compare(data.password, branch.password || "");
    if (!match) {
      throw { status: 401, message: "Wrong password" };
    }

    const token = generateToken({ id: branch.id, email: branch.email, role_id: branch.role_id });
    const refreshToken = generateRefreshToken({ id: branch.id, email: branch.email, role_id: branch.role_id });

    const { password: _, otp: __, otp_expiry: ___, ...safeBranch } = branch.toJSON();
    return { token, refreshToken, branch: safeBranch };
  },

  // ─── CHANGE PASSWORD ────────────────────────────────────
  async changePassword(branchId: string, data: any) {
    const { currentPassword, newPassword } = data;
    const branch = await Branch.findByPk(branchId);

    if (!branch) throw { status: 404, message: "Branch not found" };

    const isMatch = await bcrypt.compare(currentPassword, branch.password || "");
    if (!isMatch) throw { status: 401, message: "Incorrect current password" };

    branch.password = await bcrypt.hash(newPassword, 10);
    await branch.save();

    return { success: true, message: "Password changed successfully" };
  },

  // ─── RESET PASSWORD ─────────────────────────────────────
  async resetPassword(branchId: string, data: any) {
    const { newPassword, confirmPassword } = data;

    if (!newPassword || !confirmPassword) {
      throw { status: 400, message: "New password and confirm password are required" };
    }

    if (newPassword !== confirmPassword) {
      throw { status: 400, message: "Passwords do not match" };
    }

    const branch = await Branch.findByPk(branchId);
    if (!branch) throw { status: 404, message: "Branch not found" };

    branch.password = await bcrypt.hash(newPassword, 10);
    await branch.save();

    return { success: true, message: "Password reset successful" };
  },

  // ─── PHONE & OTP FLOWS ───────────────────────────────────
  async loginWithPhone(phone: string) {
    let numericPhone = phone.replace(/\D/g, "").slice(-10);

    if (!numericPhone) {
      throw { status: 400, message: "Invalid phone number" };
    }

    let branch = await Branch.findOne({ where: { phone: numericPhone } });
    if (!branch) {
      branch = await Branch.findOne({
        where: {
          phone: {
            [Op.like]: `%${numericPhone}`
          }
        }
      });
    }

    if (!branch) {
      throw { status: 400, message: "Phone number not registered to any branch!" };
    }

    const otp = numericPhone === APPLE_TEST_NUMBER 
      ? APPLE_TEST_OTP 
      : Math.floor(100000 + Math.random() * 900000).toString();

    branch.otp = otp;
    branch.otp_expiry = new Date(Date.now() + 5 * 60 * 1000); 
    await branch.save();

    if (numericPhone !== APPLE_TEST_NUMBER) {
      try {
        const client = getTwilioClient();
        const from = process.env.TWILIO_NUMBER;
        
        if (client && from) {
          const targetNumber = phone.startsWith("+") ? phone : `+91${numericPhone}`;
          await client.messages.create({
            body: `Your FoodScan Branch verification code is: ${otp}. Valid for 5 minutes.`,
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

    let branch = await Branch.findOne({ where: { phone: numericPhone } });
    if (!branch) {
      branch = await Branch.findOne({
        where: {
          phone: {
            [Op.like]: `%${numericPhone}`
          }
        }
      });
    }
    
    if (!branch || branch.otp !== data.otp.toString()) {
      throw { status: 400, message: "Invalid OTP" };
    }

    if (branch.otp_expiry && new Date() > branch.otp_expiry) {
      throw { status: 400, message: "OTP has expired" };
    }

    if (data.fcmToken) {
      branch.fcm_token = data.fcmToken;
    }

    branch.otp = undefined as any;
    branch.otp_expiry = undefined as any;
    await branch.save();

    const token = generateToken({ id: branch.id, email: branch.email, role_id: branch.role_id });
    const refreshToken = generateRefreshToken({ id: branch.id, email: branch.email, role_id: branch.role_id });
    
    const branchJson = branch.toJSON();
    delete (branchJson as any).password;
    delete (branchJson as any).otp;
    delete (branchJson as any).otp_expiry;

    return { token, refreshToken, branch: branchJson };
  },

  // ─── EMAIL OTP FLOWS ─────────────────────────────────────
  async sendOtpByEmail(email: string) {
    const branch = await Branch.findOne({ where: { email } });
    if (!branch) {
      throw { status: 404, message: "Branch not found with this email" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    branch.otp = otp;
    branch.otp_expiry = otpExpiry;
    await branch.save();

    try {
      await sendOtpEmail(email, otp, branch.name);
      return { success: true, message: "OTP sent to email" };
    } catch (error) {
      throw { status: 500, message: "Failed to send email" };
    }
  },

  async verifyOtpEmail(data: { email: string; otp: string }) {
    const branch = await Branch.findOne({ where: { email: data.email } });
    
    if (!branch || branch.otp !== data.otp.toString()) {
      throw { status: 400, message: "Invalid OTP" };
    }

    if (branch.otp_expiry && new Date() > branch.otp_expiry) {
      throw { status: 400, message: "OTP has expired" };
    }

    branch.otp = undefined as any;
    branch.otp_expiry = undefined as any;
    await branch.save();

    const token = generateToken({ id: branch.id, email: branch.email, role_id: branch.role_id });
    const refreshToken = generateRefreshToken({ id: branch.id, email: branch.email, role_id: branch.role_id });
    
    const branchJson = branch.toJSON();
    delete (branchJson as any).password;
    delete (branchJson as any).otp;
    delete (branchJson as any).otp_expiry;

    return { token, refreshToken, branch: branchJson };
  },

  async resetPasswordWithEmail(branchId: string, data: any) {
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

    const branch = await Branch.findByPk(branchId);

    if (!branch) {
      throw {
        status: 404,
        message: "Branch not found",
      };
    }

    branch.password = await bcrypt.hash(newPassword, 10);
    branch.otp = null as any;
    branch.otp_expiry = null as any;

    await branch.save();

    return {
      success: true,
      message: "Password reset successful",
    };
  },
};
