import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const { userId, newRole } = await req.json();

    // Validasi input
    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    // Cek apakah role baru valid
    const roleData = await prisma.role.findUnique({
      where: { name: newRole },
    });

    if (!roleData) {
      return NextResponse.json(
        { error: `Role ${newRole} does not exist` },
        { status: 400 }
      );
    }

    // Update role user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId: roleData.id },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
