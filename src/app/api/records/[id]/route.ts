import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth, canEditRecords } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Ambil data record berdasarkan id
    const record = await prisma.record.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: true, // Misalnya, data pasien terkait record
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Format data untuk dikirimkan ke frontend
    const formattedRecord = {
      id: record.id,
      patientName: `${record.patient.firstName} ${record.patient.lastName}`,
      dateOfBirth: record.patient.dateOfBirth.toISOString().split("T")[0],
      contactNumber: record.patient.phone,
      email: record.patient.email,
      address: record.patient.address,
      medicalHistory: record.medicalHistory,
      currentMedications: record.currentMedications,
      allergies: record.allergies,
      lastVisit: record.lastVisit
        ? record.lastVisit.toISOString().split("T")[0]
        : "N/A",
      nextAppointment: record.nextAppointment
        ? record.nextAppointment.toISOString().split("T")[0]
        : "N/A",
    };

    return NextResponse.json(formattedRecord);
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      { error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify authentication
  const auth = await verifyAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check authorization (DOCTOR only)
  if (!canEditRecords(auth.role)) {
    return NextResponse.json(
      { error: "Forbidden: Only doctors can edit records" },
      { status: 403 }
    );
  }

  const { id } = params;

  try {
    const body = await req.json();
    const {
      medicalHistory,
      currentMedications,
      allergies,
      lastVisit,
      nextAppointment,
    } = body;

    // Validate input
    if (!medicalHistory || !currentMedications) {
      return NextResponse.json(
        {
          error: "Medical history and current medications are required",
        },
        { status: 400 }
      );
    }

    // Parse dates
    const parsedLastVisit = lastVisit ? new Date(lastVisit) : null;
    const parsedNextAppointment = nextAppointment
      ? new Date(nextAppointment)
      : null;

    // Update record
    const updatedRecord = await prisma.record.update({
      where: { id: parseInt(id) },
      data: {
        medicalHistory,
        currentMedications,
        allergies,
        lastVisit: parsedLastVisit,
        nextAppointment: parsedNextAppointment,
      },
    });

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
