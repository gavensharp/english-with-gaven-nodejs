import { NextRequest, NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-token";

/**
 * API Route: Generate Agora RTC Token
 * GET /api/agora/token?channel=CHANNEL_NAME&uid=USER_ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelName = searchParams.get("channel");
    const uid = searchParams.get("uid") || "0";

    // Validate required parameters
    if (!channelName) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 },
      );
    }

    // Validate environment variables
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error("Missing Agora credentials in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Token will expire in 1 hour (3600 seconds)
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      parseInt(uid),
      RtcRole.PUBLISHER,
      privilegeExpiredTs,
      privilegeExpiredTs,
    );

    return NextResponse.json({
      token,
      channel: channelName,
      uid: parseInt(uid),
      expiresIn: expirationTimeInSeconds,
    });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}
