import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slotId: string }> },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const { slotId } = await params;

    const response = await fetch(
      `${BACKEND_URL}/api/availability/delete/${slotId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : { error: await response.text() };

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Delete slot error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend server" },
      { status: 500 },
    );
  }
}
