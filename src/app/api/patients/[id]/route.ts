// app/api/patient/[id]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // Await the params object before using its properties
    const { id } = params;

    const body = await req.json();

    const { firstName, lastName, dateOfBirth, phone, email, address } = body;

    // // Validasi data input
    // if (!firstName || !dateOfBirth || !phone || !address) {
    //   return NextResponse.json(
    //     { error: "All required fields must be filled." },
    //     { status: 400 }
    //   );
    // }

    // Update the patient data in the database
    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id) }, // Ensure the ID is an integer
      data: {
        firstName,
        lastName, // Can be null if not provided
        dateOfBirth: new Date(dateOfBirth),
        phone,
        email, // Can be null if not provided
        address,
      },
    });

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma error for unique constraint violation
      return NextResponse.json(
        { error: "Phone number or email already exists." },
        { status: 400 }
      );
    }
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Validasi jika ID tidak ada
    if (!id) {
      return NextResponse.json(
        { error: "Patient ID is required." },
        { status: 400 }
      );
    }

    // Hapus pasien dari database
    const deletedPatient = await prisma.patient.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Patient deleted successfully.", patient: deletedPatient },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma error untuk kasus "Record to delete does not exist."
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
