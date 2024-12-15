import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InvoiceDetailsDialog } from "./inovice-details-dialog";

interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  description: string;
}

const invoices: Invoice[] = [
  {
    id: "1",
    patientName: "John Doe",
    date: "2023-06-01",
    amount: 150.0,
    description: "General checkup",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    date: "2023-06-02",
    amount: 200.0,
    description: "Dental cleaning",
  },
  {
    id: "3",
    patientName: "Bob Johnson",
    date: "2023-06-03",
    amount: 100.0,
    description: "Follow-up consultation",
  },
  {
    id: "4",
    patientName: "Alice Brown",
    date: "2023-06-04",
    amount: 175.0,
    description: "Blood test",
  },
  {
    id: "5",
    patientName: "Charlie Wilson",
    date: "2023-06-05",
    amount: 225.0,
    description: "X-ray examination",
  },
  {
    id: "6",
    patientName: "Charles Leclerc",
    date: "2023-06-01",
    amount: 225.0,
    description: "X-ray examination",
  },
];

export function InvoiceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const invoicesPerPage = 5;

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.includes(searchTerm)
  );

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="search">Search Invoices</Label>
        <Input
          id="search"
          placeholder="Search by patient name or invoice number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.patientName}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>${invoice.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleViewDetails(invoice)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstInvoice + 1}-
          {Math.min(indexOfLastInvoice, filteredInvoices.length)} of{" "}
          {filteredInvoices.length}
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
      <InvoiceDetailsDialog
        invoice={selectedInvoice}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
