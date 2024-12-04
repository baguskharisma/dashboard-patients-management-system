"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Appointment {
  id: number;
  patientName: string;
  date: Date;
  time: string;
  type: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

const initialAppointments: Appointment[] = [
  {
    id: 1,
    patientName: "John Doe",
    date: new Date(2023, 5, 15),
    time: "09:00 AM",
    type: "Check-up",
    status: "Scheduled",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: new Date(2023, 5, 16),
    time: "02:00 PM",
    type: "Dental Cleaning",
    status: "Scheduled",
  },
  {
    id: 3,
    patientName: "Alice Johnson",
    date: new Date(2023, 5, 14),
    time: "11:00 AM",
    type: "Follow-up",
    status: "Completed",
  },
  {
    id: 4,
    patientName: "Bob Brown",
    date: new Date(2023, 5, 17),
    time: "10:30 AM",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: 5,
    patientName: "Charlie Davis",
    date: new Date(2023, 5, 13),
    time: "03:30 PM",
    type: "X-Ray",
    status: "Cancelled",
  },
];

export function AppointmentList() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id: number, newStatus: Appointment["status"]) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="search">Search Appointments</Label>
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
                    variant={
                      appointment.status === "Completed"
                        ? "secondary"
                        : "default"
                    }
                    onClick={() =>
                      handleStatusChange(appointment.id, "Completed")
                    }
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      appointment.status === "Cancelled"
                        ? "secondary"
                        : "default"
                    }
                    onClick={() =>
                      handleStatusChange(appointment.id, "Cancelled")
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
