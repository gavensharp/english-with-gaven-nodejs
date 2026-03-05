import express from "express";
import { authMiddleware } from "../utils/middleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import {
  getAvailableSlots,
  getAllSlots,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
} from "../controllers/availabilityController";

const router = express.Router();

// Public routes (anyone can view available slots)
router.get("/available", getAvailableSlots);

// Admin routes (require authentication AND admin role)
router.get("/all", authMiddleware, adminMiddleware, getAllSlots);
router.post("/create", authMiddleware, adminMiddleware, createAvailabilitySlot);
router.delete(
  "/delete/:slotId",
  authMiddleware,
  adminMiddleware,
  deleteAvailabilitySlot,
);

export default router;
