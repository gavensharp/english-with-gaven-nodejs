import { Router } from "express";
import { getAllUsers, getUserDetails } from "../controllers/adminController";
import { authMiddleware } from "../utils/middleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/users - Get all users
router.get("/users", getAllUsers);

// GET /api/admin/users/:id - Get specific user details
router.get("/users/:id", getUserDetails);

export default router;
