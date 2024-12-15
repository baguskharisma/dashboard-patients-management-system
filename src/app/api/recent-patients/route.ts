// File: /app/api/recent-patients/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  try {
    const patients = await prisma.patient.findMany({
      where: {
        appointments: {
          some: {
            status: "COMPLETED",
            date: {
              gte: twentyFourHoursAgo,
            },
          },
        },
      },
      include: {
        appointments: true, // Include appointments if needed
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching recent patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
