"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
interface Appointment {
  id: number;
  patientName: string;
  date: Date;
  time: string;
  type: "CHECK_UP" | "CONSULTATION" | "FOLLOW_UP";
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

const appointmentTypeMap = {
  CHECK_UP: "Check up",
  CONSULTATION: "Consultation",
  FOLLOW_UP: "Follow up",
};

const appointmentStatusMap = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();
        const mappedData = data.map((appointment: any) => ({
          ...appointment,
          type: appointmentTypeMap[
            appointment.type as keyof typeof appointmentTypeMap
          ],
          status:
            appointmentStatusMap[
              appointment.status as keyof typeof appointmentStatusMap
            ],
        }));
        setAppointments(mappedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (
    id: number,
    newStatus: Appointment["status"]
  ) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // console.error("Error updating status:", errorData);
        alert(`Failed to update status: ${errorData.error}`);
        return;
      }

      const updatedAppointment = await response.json();

      // Update state dengan data terbaru
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: updatedAppointment.status }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An unexpected error occurred.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          id="search"
          placeholder="Search by patient name or appointment type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{format(appointment.date, "MMM dd, yyyy")}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.type}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStatusChange(appointment.id, "COMPLETED")
                    }
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    className="bg-transparent border border-black text-black hover:bg-transparent"
                    onClick={() =>
                      handleStatusChange(appointment.id, "CANCELED")
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
