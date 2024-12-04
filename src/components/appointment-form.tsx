"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewAppointmentFormProps {
  onClose: () => void;
}

export function NewAppointmentForm({ onClose }: NewAppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: "",
    type: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("New appointment:", formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">New Appointment</h2>
      <div>
        <Label htmlFor="patientName">Patient Name</Label>
        <Input
          id="patientName"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Appointment Type</Label>
        <Select
          name="type"
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select appointment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="check-up">Check-up</SelectItem>
            <SelectItem value="dental-cleaning">Dental Cleaning</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="x-ray">X-Ray</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Appointment</Button>
      </div>
    </form>
  );
}
