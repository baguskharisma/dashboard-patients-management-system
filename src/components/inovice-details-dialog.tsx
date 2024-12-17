import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  description: string;
}

interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function InvoiceDetailsDialog({
  invoice,
  isOpen,
  onClose,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Invoice ID</Label>
            <div className="col-span-3">{invoice.id}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Patient Name</Label>
            <div className="col-span-3">{invoice.patientName}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <div className="col-span-3">{formatDate(invoice.date)}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Amount</Label>
            <div className="col-span-3">Rp {invoice.amount}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Description</Label>
            <div className="col-span-3">{invoice.description}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
