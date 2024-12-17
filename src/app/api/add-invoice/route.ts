import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { date, amount, description, patientId } = await req.json();

    // Validate input
    if (!date || !amount || !description || !patientId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create a new invoice
    const invoice = await prisma.invoice.create({
      data: {
        date: new Date(date),
        amount: Number(amount), // Ensure amount is a number
        description,
        patientId,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
