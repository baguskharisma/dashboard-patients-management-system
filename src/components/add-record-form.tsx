"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface NewRecord {
  patientName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  lastVisit: string;
  nextAppointment: string;
}

interface AddRecordFormProps {
  onClose: () => void;
}

export function AddRecordForm({ onClose }: AddRecordFormProps) {
  const [newRecord, setNewRecord] = useState<NewRecord>({
    patientName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    lastVisit: "",
    nextAppointment: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("New record:", newRecord);
    toast({
      title: "Record Added",
      description: `New record for ${newRecord.patientName} has been added.`,
    });
    onClose();
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
          <Input
            id="patientName"
            name="patientName"
            value={newRecord.patientName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={newRecord.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            name="gender"
            value={newRecord.gender}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            value={newRecord.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newRecord.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={newRecord.address}
            onChange={handleChange}
            required
          />
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
