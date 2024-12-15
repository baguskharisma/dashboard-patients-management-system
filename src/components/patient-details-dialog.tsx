import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface PatientDetailsDialogProps {
  patientDetails: PatientDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDetailsDialog({
  patientDetails,
  isOpen,
  onClose,
}: PatientDetailsDialogProps) {
  if (!patientDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Detailed information about the patient.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Name</Label>
            <div className="col-span-3">{`${patientDetails.firstName} ${patientDetails.lastName}`}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date of Birth</Label>
            <div className="col-span-3">{patientDetails.dateOfBirth}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Phone</Label>
            <div className="col-span-3">{patientDetails.phoneNumber}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email</Label>
            <div className="col-span-3">{patientDetails.email || "N/A"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Address</Label>
            <div className="col-span-3">{patientDetails.address}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
