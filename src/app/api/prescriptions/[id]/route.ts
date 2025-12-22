import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAuth, canManagePrescriptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: true,
        record: true,
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    const formatted = {
      id: prescription.id,
      medicationName: prescription.medicationName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      status: prescription.status,
      prescribedDate: prescription.prescribedDate.toISOString().split("T")[0],
      patientName: `${prescription.patient.firstName} ${prescription.patient.lastName}`,
      patientId: prescription.patientId,
      recordId: prescription.recordId,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescription" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManagePrescriptions(auth.role)) {
    return NextResponse.json(
      { error: "Forbidden: Only doctors can update prescriptions" },
      { status: 403 }
    );
  }

  const { id } = params;

  try {
    const body = await req.json();
    const {
      medicationName,
      dosage,
      frequency,
      duration,
      instructions,
      status,
      prescribedDate,
    } = body;

    const updatedPrescription = await prisma.prescription.update({
      where: { id: parseInt(id) },
      data: {
        medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        status,
        prescribedDate: prescribedDate ? new Date(prescribedDate) : undefined,
      },
      include: {
        patient: true,
        record: true,
      },
    });

    return NextResponse.json(updatedPrescription, { status: 200 });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    console.error("Error updating prescription:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManagePrescriptions(auth.role)) {
    return NextResponse.json(
      { error: "Forbidden: Only doctors can delete prescriptions" },
      { status: 403 }
    );
  }

  const { id } = params;

  try {
    // Soft delete: Update status to CANCELLED instead of hard delete
    const deletedPrescription = await prisma.prescription.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(
      {
        message: "Prescription cancelled successfully",
        prescription: deletedPrescription,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    console.error("Error deleting prescription:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
