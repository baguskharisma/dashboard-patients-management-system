import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { status } = await request.json();

    // Validasi ID
    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    // Validasi status
    if (!["SCHEDULED", "COMPLETED", "CANCELED"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status value. Allowed values are SCHEDULED, COMPLETED, CANCELED",
        },
        { status: 400 }
      );
    }

    // Periksa status saat ini di database
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    if (existingAppointment.status !== "SCHEDULED") {
      return NextResponse.json(
        {
          error:
            "Status can only be updated once and must start from 'SCHEDULED'",
        },
        { status: 403 }
      );
    }

    // Update status appointment di database
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error: any) {
    console.error("Error updating appointment:", error.message);
    return NextResponse.json(
      { error: "Failed to update appointment status" },
      { status: 500 }
    );
  }
}
