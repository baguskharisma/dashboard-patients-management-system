import { useEffect, useState } from "react";
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

interface CreateInvoiceFormProps {
  onClose: () => void;
}

interface Patient {
  id: number;
  name: string;
}

export function CreateInvoiceForm({ onClose }: CreateInvoiceFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [invoice, setInvoice] = useState({
    patientId: "",
    date: "",
    amount: "",
    description: "",
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
      const response = await fetch("/api/add-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: Number(invoice.patientId), // Kirim ID pasien
          date: invoice.date,
          amount: invoice.amount,
          description: invoice.description,
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
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
      <div>
        <Label htmlFor="patientName">Patient Name</Label>
        <Select
          onValueChange={(value) =>
            setInvoice((prev) => ({ ...prev, patientId: value }))
          }
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
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={invoice.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={invoice.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={invoice.description}
          onChange={handleChange}
          placeholder="Enter invoice description"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}
