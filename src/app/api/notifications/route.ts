import { NextResponse } from "next/server";
import { format } from "date-fns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mengambil notifikasi (appointments) yang dijadwalkan pada hari ini
export async function GET() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Set waktu ke 00:00
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set waktu ke 23:59

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: true, // Sertakan informasi pasien (opsional)
      },
      orderBy: {
        date: "asc",
      },
    });

    // Menyusun pesan notifikasi untuk setiap appointment
    const notifications = appointments.map((appointment) => ({
      id: appointment.id.toString(),
      message: `Appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} at ${appointment.time}`,
      date: format(appointment.date, "yyyy-MM-dd HH:mm:ss"),
      isRead: false, // Defaultnya, notifikasi belum dibaca
    }));

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.error();
  }
}
