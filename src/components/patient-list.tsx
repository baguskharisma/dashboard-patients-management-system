import { useState } from "react";
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

interface Patient {
  id: string;
  name: string;
  address: string;
  dateOfBirth: string;
  phoneNumber: string;
}

const patients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    address: "Maple Grove Lane",
    dateOfBirth: "1980-01-01",
    phoneNumber: "123-456-7890",
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "Sunrise Ridge Road",
    dateOfBirth: "1985-05-15",
    phoneNumber: "987-654-3210",
  },
  {
    id: "3",
    name: "Bob Johnson",
    address: "Willow Creek Drive",
    dateOfBirth: "1975-11-30",
    phoneNumber: "456-789-0123",
  },
  {
    id: "4",
    name: "Alice Brown",
    address: "Oakwood Terrace",
    dateOfBirth: "1990-07-22",
    phoneNumber: "789-012-3456",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    address: "Silver Springs Boulevard",
    dateOfBirth: "1988-03-14",
    phoneNumber: "321-654-9870",
  },
];

interface PatientListProps {
  searchQuery: string;
}

export function PatientList({ searchQuery }: PatientListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

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
          {currentPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit patient</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
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
          Showing {indexOfFirstPatient + 1}-
          {Math.min(indexOfLastPatient, filteredPatients.length)} of{" "}
          {filteredPatients.length}
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
    </div>
  );
}
