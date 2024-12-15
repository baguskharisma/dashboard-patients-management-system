import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  try {
    // Query data pasien berdasarkan nama
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search || "", // Pencarian pada firstName
              mode: "insensitive", // Case-insensitive
            },
          },
          {
            lastName: {
              contains: search || "", // Pencarian pada lastName
              mode: "insensitive", // Case-insensitive
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        phone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format nama menjadi "FirstName LastName"
    const formattedPatients = patients.map((patient) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      address: patient.address,
      dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0], // Format yyyy-mm-dd
      phoneNumber: patient.phone,
    }));

    return NextResponse.json(formattedPatients, { status: 200 });
  } catch (error) {
    console.error("Error searching patients:", error);
    return NextResponse.json(
      { error: "Failed to search patients." },
      { status: 500 }
    );
  }
}
