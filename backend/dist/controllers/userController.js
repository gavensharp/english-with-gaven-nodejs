"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateEnglishLevel = updateEnglishLevel;
exports.updateProfile = updateProfile;
exports.uploadPhoto = uploadPhoto;
const db_1 = require("../utils/db");
const auth_1 = require("../utils/auth");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Get user profile
async function getProfile(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, auth_1.verifyToken)(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const user = await db_1.prisma.user.findUnique({
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
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Update English level
async function updateEnglishLevel(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, auth_1.verifyToken)(token);
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
        const updatedUser = await db_1.prisma.user.update({
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
    }
    catch (error) {
        console.error("Update English level error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Update profile (name, dob, country, etc.)
async function updateProfile(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, auth_1.verifyToken)(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const { name, dob, country, gender, timezone } = req.body;
        // Build update object with only provided fields
        const updateData = {};
        if (name)
            updateData.name = name;
        if (dob) {
            // Convert date string to ISO DateTime (add time component)
            updateData.dob = new Date(dob).toISOString();
        }
        if (country)
            updateData.country = country;
        if (gender)
            updateData.gender = gender;
        if (timezone)
            updateData.timezone = timezone;
        const updatedUser = await db_1.prisma.user.update({
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
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Upload profile photo
async function uploadPhoto(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, auth_1.verifyToken)(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // Get user's old photo to delete it
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { profile_photo: true },
        });
        // Delete old photo if exists
        if (user?.profile_photo) {
            const oldPhotoPath = path_1.default.join(__dirname, "../../public/uploads/profile_photo", user.profile_photo);
            if (fs_1.default.existsSync(oldPhotoPath)) {
                fs_1.default.unlinkSync(oldPhotoPath);
            }
        }
        // Save new filename to database
        const filename = file.filename;
        await db_1.prisma.user.update({
            where: { id: decoded.userId },
            data: { profile_photo: filename },
        });
        res.json({
            message: "Photo uploaded successfully",
            filename,
            url: `/uploads/profile_photo/${filename}`,
        });
    }
    catch (error) {
        console.error("Upload photo error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
//# sourceMappingURL=userController.js.map