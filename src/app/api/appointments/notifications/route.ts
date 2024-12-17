import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: {} }) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Mengambil janji temu yang terjadwal hari ini
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: true, // Termasuk data pasien yang terkait dengan janji temu
      },
    });

    if (!appointments.length) {
      return NextResponse.json(
        { message: "No appointments found for today" },
        { status: 404 }
      );
    }

    // Format response sesuai kebutuhan frontend
    const notifications = appointments.map((appointment) => ({
      id: appointment.id.toString(),
      message: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} at ${appointment.time}`,
      date: appointment.date.toLocaleString(),
    }));

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
