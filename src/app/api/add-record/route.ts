import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientId,
      medicalHistory,
      currentMedications,
      allergies,
      lastVisit,
      nextAppointment,
    } = body;

    // Validasi data input
    if (!patientId || !medicalHistory || !currentMedications || !lastVisit) {
      return NextResponse.json(
        { error: "Date, time, and patient ID are required." },
        { status: 400 }
      );
    }

    // Konversi lastVisit menjadi format DateTime
    const parsedLastVisit = new Date(lastVisit);
    if (isNaN(parsedLastVisit.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format." },
        { status: 400 }
      );
    }

    // Konversi nextAppointment menjadi format DateTime
    const parsedNextAppointment = new Date(nextAppointment);
    if (isNaN(parsedNextAppointment.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format." },
        { status: 400 }
      );
    }

    // Buat appointment baru
    const newRecord = await prisma.record.create({
      data: {
        patientId,
        medicalHistory,
        currentMedications,
        allergies,
        lastVisit: parsedLastVisit,
        nextAppointment: parsedNextAppointment,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
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
