import { Request, Response } from "express";
/**
 * Generate RTC (Real-Time Communication) Token for video/audio calls
 * GET /api/agora/rtc/token?channelName=CHANNEL&uid=USER_ID
 */
export declare const generateRtcToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Generate RTM (Real-Time Messaging) Token for chat functionality
 * GET /api/agora/rtm/token?userId=USER_ID
 */
export declare const generateRtmToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Renew an existing token (same functionality as generate, but semantically different)
 * POST /api/agora/rtc/token/renew
 */
export declare const renewRtcToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=agoraController.d.ts.map