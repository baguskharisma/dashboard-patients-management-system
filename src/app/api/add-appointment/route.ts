import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, type, status, patientId } = body;

    // Validasi data input
    if (!date || !time || !type || !patientId) {
      return NextResponse.json(
        { error: "Date, time, and patient ID are required." },
        { status: 400 }
      );
    }

    // Konversi date menjadi format DateTime
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format." },
        { status: 400 }
      );
    }

    // Buat appointment baru
    const newAppointment = await prisma.appointment.create({
      data: {
        date: parsedDate,
        time,
        type: type || "CHECK_UP", // Default ke CHECK_UP jika tidak diisi
        status: status || "SCHEDULED", // Default ke SCHEDULED jika tidak diisi
        patientId,
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: any) {
    console.error("Error adding appointment:", error);

    if (error.code === "P2003") {
      // Error Prisma untuk constraint referential integrity (patientId tidak valid)
      return NextResponse.json(
        { error: "Patient ID does not exist." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
