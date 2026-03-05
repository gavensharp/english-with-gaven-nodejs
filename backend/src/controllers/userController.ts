import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { verifyToken } from "../utils/auth";
import path from "path";
import fs from "fs";

// Get user profile
export async function getProfile(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_photo: true,
        dob: true,
        gender: true,
        country: true,
        timezone: true,
        english_level: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update English level
export async function updateEnglishLevel(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { english_level } = req.body;

    if (!english_level) {
      return res.status(400).json({ error: "English level is required" });
    }

    // Validate english level
    const validLevels = [
      "Beginner",
      "Elementary",
      "Pre-Intermediate",
      "Intermediate",
      "Upper-Intermediate",
      "Advanced",
      "Proficient",
    ];

    if (!validLevels.includes(english_level)) {
      return res.status(400).json({ error: "Invalid English level" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { english_level },
      select: {
        id: true,
        name: true,
        email: true,
        english_level: true,
      },
    });

    res.json({
      message: "English level updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update English level error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update profile (name, dob, country, etc.)
export async function updateProfile(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { name, dob, country, gender, timezone} = req.body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (dob) {
      // Convert date string to ISO DateTime (add time component)
      updateData.dob = new Date(dob).toISOString();
    }
    if (country) updateData.country = country;
    if (gender) updateData.gender = gender;
    if (timezone) updateData.timezone = timezone;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profile_photo: true,
        dob: true,
        country: true,
        gender: true,
        timezone: true,
        english_level: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Upload profile photo
export async function uploadPhoto(req: Request, res: Response) {
  try {
    console.log("Upload photo - Headers:", req.headers.authorization);
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Upload photo - No auth header");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      console.log("Upload photo - Invalid token");
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Upload photo - User ID:", decoded.userId);
    console.log("Upload photo - File received:", req.file);

    const file = req.file;

    if (!file) {
      console.log("Upload photo - No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get user's old photo to delete it
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { profile_photo: true },
    });

    console.log("Upload photo - Current user photo:", user?.profile_photo);

    // Delete old photo if exists
    if (user?.profile_photo) {
      const oldPhotoPath = path.join(
        __dirname,
        "../../public/uploads/profile_photo",
        user.profile_photo,
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Save new filename to database
    const filename = file.filename;
    console.log("Upload photo - New filename:", filename);
    
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { profile_photo: filename },
    });

    console.log("Upload photo - Success!");

    res.json({
      message: "Photo uploaded successfully",
      filename,
      url: `/uploads/profile_photo/${filename}`,
    });
  } catch (error) {
    console.error("Upload photo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
