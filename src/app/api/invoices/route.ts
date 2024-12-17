import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API untuk mendapatkan data invoice
export async function GET() {
  try {
    // Query semua invoice dari database
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        patient: {
          select: {
            firstName: true, // Ambil nama pasien
            lastName: true,
          },
        },
        date: true,
        amount: true,
        description: true,
      },
    });

    // Format respons
    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      patientName:
        `${invoice.patient?.firstName} ${invoice.patient?.lastName}` ||
        "Unknown",
      date: invoice.date.toISOString().split("T")[0], // Format tanggal (YYYY-MM-DD)
      amount: invoice.amount,
      description: invoice.description,
    }));

    return NextResponse.json(formattedInvoices, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
