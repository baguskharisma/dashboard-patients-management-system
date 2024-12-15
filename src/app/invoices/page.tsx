"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { InvoiceList } from "@/components/invoices-list";
import { CreateInvoiceForm } from "@/components/create-invoice-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function InvoicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
              <Button onClick={() => setShowCreateForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>
            {showCreateForm ? (
              <CreateInvoiceForm onClose={() => setShowCreateForm(false)} />
            ) : (
              <InvoiceList />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
