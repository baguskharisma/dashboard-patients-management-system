import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
