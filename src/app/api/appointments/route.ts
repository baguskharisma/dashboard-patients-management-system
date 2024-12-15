// pages/api/appointments.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const formattedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    status: appointment.status,
  }));

  return new Response(JSON.stringify(formattedAppointments), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
