import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth, canManagePrescriptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Verify authentication
  const auth = await verifyAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check authorization (DOCTOR only)
  if (!canManagePrescriptions(auth.role)) {
    return NextResponse.json(
      { error: "Forbidden: Only doctors can create prescriptions" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      patientId,
      recordId,
      medicationName,
      dosage,
      frequency,
      duration,
      instructions,
      prescribedDate,
    } = body;

    // Validation
    if (!patientId || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json(
        {
          error:
            "Required fields: patientId, medicationName, dosage, frequency, duration",
        },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Verify record exists if provided
    if (recordId) {
      const record = await prisma.record.findUnique({
        where: { id: recordId },
      });

      if (!record || record.patientId !== patientId) {
        return NextResponse.json(
          { error: "Record not found or does not belong to patient" },
          { status: 400 }
        );
      }
    }

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        recordId: recordId || null,
        medicationName,
        dosage,
        frequency,
        duration,
        instructions: instructions || null,
        prescribedDate: prescribedDate ? new Date(prescribedDate) : new Date(),
        status: "ACTIVE",
      },
      include: {
        patient: true,
        record: true,
      },
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (error: any) {
    console.error("Error creating prescription:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid patient or record reference" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");

    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = parseInt(patientId);
    }

    if (status) {
      whereClause.status = status;
    }

    const prescriptions = await prisma.prescription.findMany({
      where: whereClause,
      include: {
        patient: true,
        record: true,
      },
      orderBy: {
        prescribedDate: "desc",
      },
    });

    const formatted = prescriptions.map((p) => ({
      id: p.id,
      medicationName: p.medicationName,
      dosage: p.dosage,
      frequency: p.frequency,
      duration: p.duration,
      instructions: p.instructions,
      status: p.status,
      prescribedDate: p.prescribedDate.toISOString().split("T")[0],
      patientName: `${p.patient.firstName} ${p.patient.lastName}`,
      patientId: p.patientId,
      recordId: p.recordId,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
