import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { search, page, perPage } = Object.fromEntries(
    new URL(req.url).searchParams
  );

  const pageNumber = parseInt(page || "1", 10);
  const pageSize = parseInt(perPage || "5", 10);

  try {
    // Hitung total pasien sesuai filter pencarian
    const totalPatients = await prisma.patient.count({
      where: {
        OR: [
          {
            firstName: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search || "",
              mode: "insensitive",
            },
          },
        ],
      },
    });

    // Ambil pasien untuk halaman tertentu
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search || "",
              mode: "insensitive",
            },
          },
        ],
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        email: true,
        dateOfBirth: true,
        phone: true,
      },
    });

    // Format nama pasien menjadi "FirstName LastName"
    const formattedPatients = patients.map((patient) => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      address: patient.address,
      dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0], // Format yyyy-mm-dd
      phoneNumber: patient.phone,
    }));

    return NextResponse.json({
      total: totalPatients,
      patients: formattedPatients,
      totalPages: Math.ceil(totalPatients / pageSize),
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients." },
      { status: 500 }
    );
  }
}
