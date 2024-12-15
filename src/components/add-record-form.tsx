"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface NewRecord {
  patientId: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  lastVisit: string;
  nextAppointment: string;
}

interface Patient {
  id: number;
  name: string;
}

interface AddRecordFormProps {
  onClose: () => void;
}

export function AddRecordForm({ onClose }: AddRecordFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newRecord, setNewRecord] = useState<NewRecord>({
    patientId: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    lastVisit: "",
    nextAppointment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  // Fetch patients when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients?page=1&perPage=100");
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        const patients = data.patients.map((patient: any) => ({
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
        }));
        setPatients(patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/add-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: Number(newRecord.patientId),
          medicalHistory: newRecord.medicalHistory,
          currentMedications: newRecord.currentMedications,
          allergies: newRecord.allergies,
          lastVisit: newRecord.lastVisit,
          nextAppointment: newRecord.nextAppointment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      const result = await response.json();
      console.log("Appointment created:", result);

      // Tutup form setelah berhasil
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Patient Record</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Patient Name</Label>
          <Select
            onValueChange={(value) => {
              setNewRecord((prev) => ({ ...prev, patientId: value }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={String(patient.id)}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="medicalHistory">Medical History</Label>
        <Textarea
          id="medicalHistory"
          name="medicalHistory"
          value={newRecord.medicalHistory}
          onChange={handleChange}
          className="min-h-[100px]"
        />
      </div>
      <div>
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          name="currentMedications"
          value={newRecord.currentMedications}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Input
          id="allergies"
          name="allergies"
          value={newRecord.allergies}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lastVisit">Last Visit</Label>
          <Input
            id="lastVisit"
            name="lastVisit"
            type="date"
            value={newRecord.lastVisit}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nextAppointment">Next Appointment</Label>
          <Input
            id="nextAppointment"
            name="nextAppointment"
            type="date"
            value={newRecord.nextAppointment}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add Record</Button>
      </div>
    </form>
  );
}
