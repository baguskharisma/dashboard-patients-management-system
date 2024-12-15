import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 10;

export async function POST(req: Request) {
  try {
    const { name, email, role, password } = await req.json();

    // Validasi input
    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 }
      );
    }

    // Cari ID role berdasarkan nama role
    const roleData = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleData) {
      return NextResponse.json(
        { error: `Role ${role} does not exist` },
        { status: 400 }
      );
    }

    // Hashing password dengan bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: roleData.id,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
