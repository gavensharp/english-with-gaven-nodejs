import express from "express";
import { signup, login } from "../controllers/authController";
import { authRateLimit } from "../middleware/authRateLimit";

const router = express.Router();

router.post("/signup", authRateLimit, signup);
router.post("/login", authRateLimit, login);

export default router;
