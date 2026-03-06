import express from "express";
import {
  generateRtcToken,
  generateRtmToken,
  renewRtcToken,
} from "../controllers/agoraController";

const router = express.Router();

/**
 * @route   GET /api/agora/rtc/token
 * @desc    Generate RTC token for video/audio call
 * @access  Public (consider adding authentication middleware if needed)
 * @query   channelName - The name of the channel
 * @query   uid - User ID (optional, defaults to 0)
 * @query   role - User role: 'publisher' or 'subscriber' (optional, defaults to 'publisher')
 */
router.get("/rtc/token", generateRtcToken);

/**
 * @route   POST /api/agora/rtc/token/renew
 * @desc    Renew RTC token before expiration
 * @access  Public (consider adding authentication middleware if needed)
 * @body    channelName - The name of the channel
 * @body    uid - User ID
 * @body    role - User role
 */
router.post("/rtc/token/renew", renewRtcToken);

/**
 * @route   GET /api/agora/rtm/token
 * @desc    Generate RTM token for real-time messaging
 * @access  Public (consider adding authentication middleware if needed)
 * @query   userId - User ID for RTM
 */
router.get("/rtm/token", generateRtmToken);

export default router;
