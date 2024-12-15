import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, dateOfBirth, phone, email, address } = body;

    // Validasi data input
    if (!firstName || !dateOfBirth || !phone || !address) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // Simpan data pasien ke database
    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName, // Bisa null jika tidak diisi
        dateOfBirth: new Date(dateOfBirth),
        phone,
        email, // Bisa null jika tidak diisi
        address,
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Error Prisma untuk unique constraint
      return NextResponse.json(
        { error: "Phone number or email already exists." },
        { status: 400 }
      );
    }
    console.error("Error adding patient:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
