"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

const mockFetchRecord = (id: number): Promise<RecordData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        patientName: "John Doe",
        dateOfBirth: "1980-05-15",
        gender: "Male",
        contactNumber: "123-456-7890",
        email: "john.doe@example.com",
        address: "123 Main St, Anytown, USA",
        medicalHistory: "Hypertension, Diabetes",
        currentMedications: "Lisinopril, Metformin",
        allergies: "Penicillin",
        lastVisit: "2023-05-01",
        nextAppointment: "2023-06-15",
      });
    }, 500);
  });
};

export function RecordDetails({ recordId }: RecordDetailsProps) {
  const [record, setRecord] = useState<RecordData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    mockFetchRecord(recordId).then(setRecord);
  }, [recordId]);

  if (!record) {
    return <div className="bg-white p-6 rounded-lg shadow">Loading...</div>;
  }

  const handleSave = () => {
    // Here you would typically send the updated record to your backend
    console.log("Saving record:", record);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient Record</h2>
        {isEditing ? (
          <div>
            <Button onClick={handleSave} className="mr-2">
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            value={record.patientName}
            onChange={(e) =>
              setRecord({ ...record, patientName: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            value={record.dateOfBirth}
            onChange={(e) =>
              setRecord({ ...record, dateOfBirth: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            value={record.gender}
            onChange={(e) => setRecord({ ...record, gender: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            value={record.contactNumber}
            onChange={(e) =>
              setRecord({ ...record, contactNumber: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={record.email}
            onChange={(e) => setRecord({ ...record, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={record.address}
            onChange={(e) => setRecord({ ...record, address: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="medicalHistory">Medical History</Label>
          <Textarea
            id="medicalHistory"
            value={record.medicalHistory}
            onChange={(e) =>
              setRecord({ ...record, medicalHistory: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="currentMedications">Current Medications</Label>
          <Textarea
            id="currentMedications"
            value={record.currentMedications}
            onChange={(e) =>
              setRecord({ ...record, currentMedications: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Input
            id="allergies"
            value={record.allergies}
            onChange={(e) =>
              setRecord({ ...record, allergies: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="lastVisit">Last Visit</Label>
          <Input
            id="lastVisit"
            value={record.lastVisit}
            onChange={(e) =>
              setRecord({ ...record, lastVisit: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="nextAppointment">Next Appointment</Label>
          <Input
            id="nextAppointment"
            value={record.nextAppointment}
            onChange={(e) =>
              setRecord({ ...record, nextAppointment: e.target.value })
            }
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}
