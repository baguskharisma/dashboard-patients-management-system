"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Record {
  id: number;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  lastVisit: string;
  nextAppointment: string;
}

interface EditRecordDialogProps {
  record: Record | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: Record) => void;
}

export function EditRecordDialog({
  record,
  isOpen,
  onClose,
  onSave,
}: EditRecordDialogProps) {
  const [editedRecord, setEditedRecord] = useState<Record | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (record) {
      setEditedRecord({ ...record });
    }
  }, [record]);

  if (!editedRecord) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedRecord((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/records/${record?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicalHistory: editedRecord.medicalHistory,
          currentMedications: editedRecord.currentMedications,
          allergies: editedRecord.allergies,
          lastVisit: editedRecord.lastVisit === "N/A" ? null : editedRecord.lastVisit,
          nextAppointment: editedRecord.nextAppointment === "N/A" ? null : editedRecord.nextAppointment,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        onSave(editedRecord);
        toast({
          title: "Record Updated",
          description: "Medical record has been successfully updated.",
        });
        onClose();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update record",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Medical Record</DialogTitle>
          <DialogDescription>
            Update the patient's medical information. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              value={editedRecord.medicalHistory}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              name="currentMedications"
              value={editedRecord.currentMedications}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              name="allergies"
              value={editedRecord.allergies}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lastVisit">Last Visit</Label>
              <Input
                id="lastVisit"
                name="lastVisit"
                type="date"
                value={editedRecord.lastVisit === "N/A" ? "" : editedRecord.lastVisit}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nextAppointment">Next Appointment</Label>
              <Input
                id="nextAppointment"
                name="nextAppointment"
                type="date"
                value={editedRecord.nextAppointment === "N/A" ? "" : editedRecord.nextAppointment}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
