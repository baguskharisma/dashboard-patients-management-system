import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export interface AuthPayload {
  userId: number;
  email: string;
  role: number;
}

export async function verifyAuth(
  request: NextRequest
): Promise<AuthPayload | null> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    return payload as unknown as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function isDoctor(roleId: number): boolean {
  return roleId === 2;
}

export function canEditRecords(roleId: number): boolean {
  return isDoctor(roleId);
}

export function canManagePrescriptions(roleId: number): boolean {
  return isDoctor(roleId);
}
