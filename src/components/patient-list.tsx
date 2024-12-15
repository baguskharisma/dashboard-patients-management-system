import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PatientDetailsDialog } from "./patient-details-dialog";
import { EditPatientDialog } from "./edit-patient-dialog";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

interface PatientListProps {
  searchQuery: string;
}

export function PatientList({ searchQuery }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const patientsPerPage = 5;
  const { toast } = useToast();

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (editedPatient: Patient) => {
    try {
      // Kirim perubahan ke API (edit patient)
      const response = await fetch(`/api/patients/${editedPatient.id}`, {
        method: "PUT",
        body: JSON.stringify(editedPatient),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Perbarui data pasien di state induk
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === editedPatient.id ? editedPatient : patient
          )
        );
        toast({
          title: "Patient Updated",
          description: `${editedPatient.firstName} ${editedPatient.lastName}'s information has been updated.`,
        });
      } else {
        throw new Error("Failed to update patient");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPatients((prevPatients) =>
          prevPatients.filter((patient) => patient.id !== patientId)
        );
        toast({
          title: "Patient Deleted",
          description: "The patient has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete patient");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the patient.",
        variant: "destructive",
      });
    }
  };

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `/api/patients?search=${searchQuery}&page=${currentPage}&perPage=${patientsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patients.");
        }
        const data = await response.json();
        setPatients(data.patients);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatients();
  }, [searchQuery, currentPage]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                {`${patient.firstName} ${patient.lastName}`}
              </TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.dateOfBirth}</TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(patient)}
                    >
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditPatient(patient)}
                    >
                      Edit patient
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-600"
                    >
                      Delete patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      <PatientDetailsDialog
        patientDetails={selectedPatient}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
      <EditPatientDialog
        patient={selectedPatient}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
