import { Router } from "express";
import {
  getProfile,
  updateEnglishLevel,
  updateProfile,
  uploadPhoto,
} from "../controllers/userController";
import { upload } from "../middleware/upload";

const router = Router();

// GET /api/users/profile - Get user profile
router.get("/profile", getProfile);

// PUT /api/users/profile - Update user profile
router.put("/profile", updateProfile);

// PUT /api/users/english-level - Update English level
router.put("/english-level", updateEnglishLevel);

// POST /api/users/upload-photo - Upload profile photo
router.post("/upload-photo", upload.single("photo"), uploadPhoto);

export default router;
