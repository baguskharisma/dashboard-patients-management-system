import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalPatients = await prisma.patient.count();
    const newPatients = await prisma.patient.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 hari terakhir
        },
      },
    });
    const appointments = await prisma.appointment.count();

    return NextResponse.json({
      totalPatients,
      newPatients,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics." },
      { status: 500 }
    );
  }
}
