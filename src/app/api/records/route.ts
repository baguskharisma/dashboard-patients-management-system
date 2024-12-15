import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch records from the database
    const records = await prisma.record.findMany({
      include: {
        patient: true, // Include patient information if needed
      },
    });

    const formattedRecords = records.map((record) => ({
      id: record.id,
      patientName: `${record.patient.firstName} ${record.patient.lastName}`,
      dateOfBirth: record.patient.dateOfBirth.toISOString().split("T")[0], // Format date to YYYY-MM-DD
      lastVisit: record.lastVisit
        ? record.lastVisit.toISOString().split("T")[0]
        : "N/A",
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}
