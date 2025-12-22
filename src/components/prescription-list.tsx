"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: string;
  prescribedDate: string;
  patientName: string;
}

interface PrescriptionListProps {
  onEdit?: (prescription: Prescription) => void;
  patientId?: number;
}

export function PrescriptionList({
  onEdit,
  patientId,
}: PrescriptionListProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const { canManagePrescriptions } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      const url = patientId
        ? `/api/prescriptions?patientId=${patientId}`
        : `/api/prescriptions`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this prescription?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Prescription Cancelled",
          description: "The prescription has been successfully cancelled.",
        });
        fetchPrescriptions();
      } else {
        throw new Error("Failed to cancel prescription");
      }
    } catch (error) {
      console.error("Error cancelling prescription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel prescription",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      ACTIVE: "default",
      COMPLETED: "secondary",
      CANCELLED: "destructive",
      EXPIRED: "outline",
    };

    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading prescriptions...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prescribed Date</TableHead>
            {!patientId && <TableHead>Patient</TableHead>}
            {canManagePrescriptions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={patientId ? 7 : 8}
                className="text-center text-gray-500"
              >
                No prescriptions found
              </TableCell>
            </TableRow>
          ) : (
            prescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell className="font-medium">
                  {prescription.medicationName}
                </TableCell>
                <TableCell>{prescription.dosage}</TableCell>
                <TableCell>{prescription.frequency}</TableCell>
                <TableCell>{prescription.duration}</TableCell>
                <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                <TableCell>{prescription.prescribedDate}</TableCell>
                {!patientId && <TableCell>{prescription.patientName}</TableCell>}
                {canManagePrescriptions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(prescription)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCancel(prescription.id)}
                          className="text-red-600"
                        >
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
