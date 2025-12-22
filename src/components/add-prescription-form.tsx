"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewPrescription {
  patientId: string;
  recordId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedDate: string;
}

interface Patient {
  id: number;
  name: string;
}

interface Record {
  id: number;
  lastVisit: string;
}

interface AddPrescriptionFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  preselectedPatientId?: number;
}

export function AddPrescriptionForm({
  onClose,
  onSuccess,
  preselectedPatientId,
}: AddPrescriptionFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [newPrescription, setNewPrescription] = useState<NewPrescription>({
    patientId: preselectedPatientId?.toString() || "",
    recordId: "",
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    prescribedDate: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (newPrescription.patientId) {
      fetchRecordsForPatient(parseInt(newPrescription.patientId));
    } else {
      setRecords([]);
    }
  }, [newPrescription.patientId]);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients?page=1&perPage=100");
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data = await response.json();
      const patientsList = data.patients.map((patient: any) => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
      }));
      setPatients(patientsList);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    }
  };

  const fetchRecordsForPatient = async (patientId: number) => {
    try {
      const response = await fetch(`/api/records?patientId=${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch records");

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: parseInt(newPrescription.patientId),
          recordId: newPrescription.recordId
            ? parseInt(newPrescription.recordId)
            : null,
          medicationName: newPrescription.medicationName,
          dosage: newPrescription.dosage,
          frequency: newPrescription.frequency,
          duration: newPrescription.duration,
          instructions: newPrescription.instructions,
          prescribedDate: newPrescription.prescribedDate,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create prescription");
      }

      toast({
        title: "Prescription Created",
        description: "The prescription has been successfully created.",
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error creating prescription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create prescription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Prescription</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientId">Patient *</Label>
          <Select
            value={newPrescription.patientId}
            onValueChange={(value) =>
              setNewPrescription((prev) => ({ ...prev, patientId: value }))
            }
            disabled={!!preselectedPatientId}
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

        <div>
          <Label htmlFor="recordId">Medical Record (Optional)</Label>
          <Select
            value={newPrescription.recordId || "none"}
            onValueChange={(value) =>
              setNewPrescription((prev) => ({ 
                ...prev, 
                recordId: value === "none" ? "" : value 
              }))
            }
            disabled={!newPrescription.patientId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a record" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {records.map((record) => (
                <SelectItem key={record.id} value={String(record.id)}>
                  Record from {record.lastVisit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="medicationName">Medication Name *</Label>
        <Input
          id="medicationName"
          name="medicationName"
          value={newPrescription.medicationName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            name="dosage"
            placeholder="e.g., 500mg"
            value={newPrescription.dosage}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="frequency">Frequency *</Label>
          <Input
            id="frequency"
            name="frequency"
            placeholder="e.g., Twice daily"
            value={newPrescription.frequency}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            name="duration"
            placeholder="e.g., 7 days"
            value={newPrescription.duration}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          name="instructions"
          placeholder="Additional instructions for the patient"
          value={newPrescription.instructions}
          onChange={handleChange}
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="prescribedDate">Prescribed Date</Label>
        <Input
          id="prescribedDate"
          name="prescribedDate"
          type="date"
          value={newPrescription.prescribedDate}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Prescription"}
        </Button>
      </div>
    </form>
  );
}
