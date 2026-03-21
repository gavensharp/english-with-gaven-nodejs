import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/availability/available`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Available slots fetch error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend server" },
      { status: 500 },
    );
  }
}
