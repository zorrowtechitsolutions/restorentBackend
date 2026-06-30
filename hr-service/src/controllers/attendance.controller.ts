import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Op } from "sequelize";
import Attendance from "../models/attendance.model";
import fs from "fs";
import path from "path";
import { verificationService } from "../services/verification.service";
import { locationService } from "../services/location.service";
import { publishEvent } from "../events/publisher";

export const createAttendance: any = asyncHandler(async (req: Request, res: Response) => {
  const { branch_id, emp_id, type, selfie_url } = req.body;
  const latitude = req.body.latitude ?? req.body.location?.lat;
  const longitude = req.body.longitude ?? req.body.location?.lng;
  const image = req.body.image || selfie_url; // Fallback for EMS style frontend

  const currentDate = new Date();
  
  // Start and end of the current day for checking duplicates
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

  // 1. Double check for existing record today (Safety check)
  const existingResult = await Attendance.findOne({
    where: {
      emp_id,
      type,
      timestamp: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      }
    }
  });

  if (existingResult) {
    res.status(400).json({ 
      success: false, 
      message: `You have already recorded a ${type} for today.` 
    });
    return;
  }

  // 2. Location Verification Check
  const locationVerification = await locationService.verifyAttendanceLocation(branch_id, latitude, longitude);
  if (!locationVerification.success) {
    res.status(403).json({
      success: false,
      message: locationVerification.message,
      distanceMeters: locationVerification.distanceMeters,
      allowedRadiusMeters: locationVerification.allowedRadiusMeters,
    });
    return;
  }

  // 3. Face Verification Check
  const verification = await verificationService.verifyFace(emp_id, image);
  if (!verification.success) {
    res.status(403).json({ 
      success: false, 
      message: verification.message 
    });
    return;
  }

  const timestamp = new Date();
  
  // 4. Handle Image Storage (EMS logic)
  let final_selfie_url = image;
  if (image && image.startsWith("data:image")) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const fileName = `attendance_${emp_id}_${Date.now()}.jpg`;
    
    // Ensure dir exists
    const uploadDir = path.join(__dirname, "../../uploads/attendance");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const uploadPath = path.join(uploadDir, fileName);
    fs.writeFileSync(uploadPath, base64Data, 'base64');
    final_selfie_url = `/uploads/attendance/${fileName}`;
  }

  // 5. Determine status (Late vs Present)
  const hours = timestamp.getHours();
  const minutes = timestamp.getMinutes();
  let status = "verified";
  
  if (type === "check-in") {
    // Shift Start: 09:30
    if (hours > 9 || (hours === 9 && minutes > 30)) {
      status = "Late";
    } else {
      status = "Present";
    }
  } else if (type === "check-out") {
    // Shift End: 21:30 (9:30 PM)
    if (hours < 21 || (hours === 21 && minutes < 30)) {
      status = "Early Departure";
    } else {
      status = "Shift Completed";
    }
  }

  const attendance = await Attendance.create({
      branch_id,
      emp_id,
      type,
      timestamp,
      latitude,
      longitude,
      selfie_url: final_selfie_url,
      status
  });

  try {
    await publishEvent("hr_events", "ATTENDANCE_REGISTERED", {
      attendanceId: attendance.id,
      emp_id: attendance.emp_id,
      type: attendance.type,
      status: attendance.status
    });
  } catch (err: any) {
    console.error("Failed to publish ATTENDANCE_REGISTERED event:", { error: err.message });
  }

  res.status(201).json({ 
    success: true, 
    status,
    message: `${type} successful`,
    data: attendance
  });
});

export const getAttendances: any = asyncHandler(async (req: Request, res: Response) => {
  const where: any = {};
  if (req.query.emp_id) where.emp_id = req.query.emp_id;
  if (req.query.branch_id) where.branch_id = req.query.branch_id;
  
  const attendances = await Attendance.findAll({ 
    where,
    order: [['timestamp', 'DESC']]
  });
  res.status(200).json({ success: true, data: attendances });
});

export const getDailyStatus: any = asyncHandler(async (req: Request, res: Response) => {
  const emp_id = req.query.emp_id || req.params.emp_id;
  const currentDate = new Date();
  
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

  const attendances = await Attendance.findAll({
    where: {
      emp_id,
      timestamp: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      }
    }
  });
  
  const hasCheckedIn = attendances.some((r: any) => r.type === "check-in");
  const hasCheckedOut = attendances.some((r: any) => r.type === "check-out");

  res.json({ success: true, hasCheckedIn, hasCheckedOut });
});

export const getAttendance: any = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await Attendance.findByPk(req.params.id);
  if (!attendance) { res.status(404).json({ success: false, message: "Attendance not found" }); return; }
  res.status(200).json({ success: true, data: attendance });
});

export const updateAttendance: any = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await Attendance.findByPk(req.params.id);
  if (!attendance) { res.status(404).json({ success: false, message: "Attendance not found" }); return; }
  await attendance.update(req.body);

  try {
    await publishEvent("hr_events", "ATTENDANCE_UPDATED", {
      attendanceId: attendance.id,
      emp_id: attendance.emp_id,
    });
  } catch (err: any) {
    console.error("Failed to publish ATTENDANCE_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: attendance });
});

export const deleteAttendance: any = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await Attendance.findByPk(req.params.id);
  if (!attendance) { res.status(404).json({ success: false, message: "Attendance not found" }); return; }
  await attendance.destroy();

  try {
    await publishEvent("hr_events", "ATTENDANCE_DELETED", {
      attendanceId: attendance.id,
      emp_id: attendance.emp_id,
    });
  } catch (err: any) {
    console.error("Failed to publish ATTENDANCE_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Attendance deleted successfully" });
});
