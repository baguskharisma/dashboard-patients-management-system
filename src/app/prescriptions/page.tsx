"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { PrescriptionList } from "@/components/prescription-list";
import { AddPrescriptionForm } from "@/components/add-prescription-form";
import { EditPrescriptionDialog } from "@/components/edit-prescription-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function PrescriptionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { canManagePrescriptions } = useAuth();

  const handleEditPrescription = (prescription: any) => {
    setEditingPrescription(prescription);
  };

  const handleSaveSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Prescriptions
              </h1>
              {canManagePrescriptions && (
                <Button onClick={() => setShowAddForm(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Prescription
                </Button>
              )}
            </div>

            {showAddForm ? (
              <AddPrescriptionForm
                onClose={() => setShowAddForm(false)}
                onSuccess={handleSaveSuccess}
              />
            ) : (
              <PrescriptionList
                key={refreshKey}
                onEdit={handleEditPrescription}
              />
            )}
          </div>
        </main>
      </div>

      <EditPrescriptionDialog
        prescription={editingPrescription}
        isOpen={!!editingPrescription}
        onClose={() => setEditingPrescription(null)}
        onSave={handleSaveSuccess}
      />
    </div>
  );
}
