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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  status: string;
  prescribedDate: string;
}

interface EditPrescriptionDialogProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditPrescriptionDialog({
  prescription,
  isOpen,
  onClose,
  onSave,
}: EditPrescriptionDialogProps) {
  const [editedPrescription, setEditedPrescription] =
    useState<Prescription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (prescription) {
      setEditedPrescription({ ...prescription });
    }
  }, [prescription]);

  if (!editedPrescription) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPrescription((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/prescriptions/${prescription?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicationName: editedPrescription.medicationName,
          dosage: editedPrescription.dosage,
          frequency: editedPrescription.frequency,
          duration: editedPrescription.duration,
          instructions: editedPrescription.instructions,
          status: editedPrescription.status,
          prescribedDate: editedPrescription.prescribedDate,
        }),
      });

      if (response.ok) {
        toast({
          title: "Prescription Updated",
          description: "The prescription has been successfully updated.",
        });
        onSave();
        onClose();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update prescription",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating prescription:", error);
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
          <DialogTitle>Edit Prescription</DialogTitle>
          <DialogDescription>
            Update prescription details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="medicationName">Medication Name</Label>
            <Input
              id="medicationName"
              name="medicationName"
              value={editedPrescription.medicationName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                value={editedPrescription.dosage}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                name="frequency"
                value={editedPrescription.frequency}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={editedPrescription.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={editedPrescription.instructions || ""}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedPrescription.status}
                onValueChange={(value) =>
                  setEditedPrescription((prev) => ({ ...prev!, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prescribedDate">Prescribed Date</Label>
              <Input
                id="prescribedDate"
                name="prescribedDate"
                type="date"
                value={editedPrescription.prescribedDate}
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
