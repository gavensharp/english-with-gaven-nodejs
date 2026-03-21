"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renewRtcToken = exports.generateRtmToken = exports.generateRtcToken = void 0;
const agora_token_1 = require("agora-token");
/**
 * Generate RTC (Real-Time Communication) Token for video/audio calls
 * GET /api/agora/rtc/token?channelName=CHANNEL&uid=USER_ID
 */
const generateRtcToken = async (req, res) => {
    try {
        const { channelName, uid, role } = req.query;
        // Validate required parameters
        if (!channelName) {
            return res.status(400).json({
                error: "Channel name is required",
            });
        }
        // Validate environment variables
        const appId = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;
        if (!appId || !appCertificate) {
            console.error("Missing Agora credentials in environment variables");
            return res.status(500).json({
                error: "Server configuration error: Missing Agora credentials",
            });
        }
        // Parse uid (default to 0 for string-based user IDs)
        const userId = uid ? parseInt(uid) : 0;
        // Determine role (PUBLISHER can send and receive, SUBSCRIBER can only receive)
        const userRole = role === "subscriber" ? agora_token_1.RtcRole.SUBSCRIBER : agora_token_1.RtcRole.PUBLISHER;
        // Token expiration: 24 hours (86400 seconds)
        const expirationTimeInSeconds = 86400;
        // Build RTC token
        // Note: tokenExpire and privilegeExpire are both set to the same value
        const token = agora_token_1.RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, userId, userRole, expirationTimeInSeconds, expirationTimeInSeconds);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        return res.status(200).json({
            success: true,
            data: {
                token,
                appId,
                channelName,
                uid: userId,
                role: role || "publisher",
                expiresIn: expirationTimeInSeconds,
                expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Error generating RTC token:", error);
        return res.status(500).json({
            error: "Failed to generate RTC token",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.generateRtcToken = generateRtcToken;
/**
 * Generate RTM (Real-Time Messaging) Token for chat functionality
 * GET /api/agora/rtm/token?userId=USER_ID
 */
const generateRtmToken = async (req, res) => {
    try {
        const { userId } = req.query;
        // Validate required parameters
        if (!userId) {
            return res.status(400).json({
                error: "User ID is required",
            });
        }
        // Validate environment variables
        const appId = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;
        if (!appId || !appCertificate) {
            console.error("Missing Agora credentials in environment variables");
            return res.status(500).json({
                error: "Server configuration error: Missing Agora credentials",
            });
        }
        // Token expiration: 24 hours (86400 seconds)
        const expirationTimeInSeconds = 86400;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        // Build Chat (RTM) token using ChatTokenBuilder
        const token = agora_token_1.ChatTokenBuilder.buildUserToken(appId, appCertificate, userId, expirationTimeInSeconds);
        return res.status(200).json({
            success: true,
            data: {
                token,
                appId,
                userId,
                expiresIn: expirationTimeInSeconds,
                expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
            },
        });
    }
    catch (error) {
        console.error("Error generating RTM token:", error);
        return res.status(500).json({
            error: "Failed to generate RTM token",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.generateRtmToken = generateRtmToken;
/**
 * Renew an existing token (same functionality as generate, but semantically different)
 * POST /api/agora/rtc/token/renew
 */
const renewRtcToken = async (req, res) => {
    // Reuse the same logic as generateRtcToken
    req.query = req.body;
    return (0, exports.generateRtcToken)(req, res);
};
exports.renewRtcToken = renewRtcToken;
//# sourceMappingURL=agoraController.js.map