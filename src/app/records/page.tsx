"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { RecordsList } from "@/components/records-list";
import { RecordDetails } from "@/components/record-details";
import { AddRecordForm } from "@/components/add-record-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function RecordsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Patient Records
              </h1>
              <Button onClick={() => setShowAddForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Record
              </Button>
            </div>
            {showAddForm ? (
              <AddRecordForm onClose={() => setShowAddForm(false)} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <RecordsList onSelectRecord={setSelectedRecordId} />
                </div>
                <div className="md:col-span-2">
                  {selectedRecordId ? (
                    <RecordDetails recordId={selectedRecordId} />
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                      <p className="text-gray-500">
                        Select a record to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
