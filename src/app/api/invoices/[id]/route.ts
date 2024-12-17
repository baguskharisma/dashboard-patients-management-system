import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Ambil invoice berdasarkan ID dengan relasi pasien
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        patient: true, // Ambil data pasien terkait
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }

    // Format response sesuai kebutuhan frontend
    return NextResponse.json({
      id: invoice.id,
      date: invoice.date.toISOString(),
      amount: invoice.amount,
      description: invoice.description,
      patientName: `${invoice.patient.firstName} ${invoice.patient.lastName}`,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
