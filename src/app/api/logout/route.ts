// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Create a response to clear the token cookie
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // Clear the token cookie
  response.cookies.delete("token");

  return response;
}
