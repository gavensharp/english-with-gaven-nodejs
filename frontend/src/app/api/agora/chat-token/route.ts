import { NextRequest, NextResponse } from "next/server";
import { ChatTokenBuilder } from "agora-token";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		const appId = process.env.AGORA_APP_ID;
		const appCertificate = process.env.AGORA_APP_CERTIFICATE;

		if (!appId || !appCertificate) {
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 },
			);
		}

		const expirationTimeInSeconds = 86400;
		const now = Math.floor(Date.now() / 1000);
		const expiresAt = now + expirationTimeInSeconds;

		const token = ChatTokenBuilder.buildUserToken(
			appId,
			appCertificate,
			userId,
			expirationTimeInSeconds,
		);

		return NextResponse.json({
			success: true,
			data: {
				token,
				appId,
				userId,
				expiresIn: expirationTimeInSeconds,
				expiresAt: new Date(expiresAt * 1000).toISOString(),
			},
		});
	} catch (error) {
		console.error("Error generating RTM token:", error);
		return NextResponse.json(
			{ error: "Failed to generate RTM token" },
			{ status: 500 },
		);
	}
}
