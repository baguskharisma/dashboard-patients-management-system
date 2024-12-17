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

export function InvoiceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const invoicesPerPage = 5;

  // Load invoices from API
  useEffect(() => {
    async function fetchInvoices() {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      setInvoices(data);
    }
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  // Fetch invoice details
  const handleViewDetails = async (id: string) => {
    const response = await fetch(`/api/invoices/${id}`);
    const data = await response.json();
    setSelectedInvoice(data);
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
              <TableCell>Rp {invoice.amount.toLocaleString("id-ID")}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleViewDetails(invoice.id)}
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
          Showing {indexOfFirstInvoice + 1}-{" "}
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
