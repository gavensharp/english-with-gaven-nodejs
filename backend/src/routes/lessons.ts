import express from "express";
import { authMiddleware } from "../utils/middleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import {
  getMyLessons,
  bookLesson,
  cancelLesson,
  getAllLessons,
} from "../controllers/lessonController";

const router = express.Router();

// Protected routes (require authentication)
router.get("/my-lessons", authMiddleware, getMyLessons);
router.post("/book", authMiddleware, bookLesson); // Changed from /book/:lessonId
router.delete("/cancel/:lessonId", authMiddleware, cancelLesson);

// Admin routes (require authentication AND admin role)
router.get("/all", authMiddleware, adminMiddleware, getAllLessons);

export default router;
