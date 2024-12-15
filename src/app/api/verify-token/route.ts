import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    return NextResponse.json({ isValid: true });
  } catch (error) {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}
