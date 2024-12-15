"use client";

import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RecordDetailsProps {
  recordId: number;
}

interface RecordData {
  id: number;
  patientName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  address: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  lastVisit: string;
  nextAppointment: string;
}

export function RecordDetails({ recordId }: RecordDetailsProps) {
  const [record, setRecord] = useState<RecordData | null>(null);
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch data from API when recordId changes
    const fetchRecord = async () => {
      try {
        const res = await fetch(`/api/records/${recordId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch record");
        }
        const data = await res.json();
        setRecord(data);
      } catch (error) {
        console.error("Error fetching record:", error);
      }
    };

    fetchRecord();
  }, [recordId]);

  if (!record) {
    return <div className="bg-white p-6 rounded-lg shadow">Loading...</div>;
  }

  // const handleSave = () => {
  //   // Here you would typically send the updated record to your backend
  //   console.log("Saving record:", record);
  //   setIsEditing(false);
  // };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Patient Record</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Patient Name</Label>
          <Input id="patientName" value={record.patientName} disabled />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" value={record.dateOfBirth} disabled />
        </div>
        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input id="contactNumber" value={record.contactNumber} disabled />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={record.email} disabled />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={record.address} disabled />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="medicalHistory">Medical History</Label>
          <Textarea
            id="medicalHistory"
            value={record.medicalHistory}
            disabled
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="currentMedications">Current Medications</Label>
          <Textarea
            id="currentMedications"
            value={record.currentMedications}
            disabled
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input id="allergies" value={record.allergies} disabled />
        </div>
        <div>
          <Label htmlFor="lastVisit">Last Visit</Label>
          <Input id="lastVisit" value={record.lastVisit} disabled />
        </div>
        <div>
          <Label htmlFor="nextAppointment">Next Appointment</Label>
          <Input id="nextAppointment" value={record.nextAppointment} disabled />
        </div>
      </div>
    </div>
  );
}
