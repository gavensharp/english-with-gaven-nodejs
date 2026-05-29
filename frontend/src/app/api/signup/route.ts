import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
).replace(/\/$/, "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Proxy to Express backend
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type") || "";
    const responseText = await response.text();

    if (contentType.includes("application/json")) {
      const data = responseText ? JSON.parse(responseText) : {};
      return NextResponse.json(data, { status: response.status });
    }

    return new NextResponse(responseText, {
      status: response.status,
      headers: contentType ? { "Content-Type": contentType } : undefined,
    });
  } catch (error) {
    console.error("Signup proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend server" },
      { status: 500 },
    );
  }
}
