"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { PatientList } from "@/components/patient-list";
import { PatientSearch } from "@/components/patient-search";
import { AddPatientForm } from "@/components/add-patient-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PatientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPatient = (newPatient: any) => {
    // Here you would typically send the data to your backend
    console.log("New patient:", newPatient);
    // Then update the patient list
    setShowAddForm(false);
    // Optionally, you could update the local state or refetch the patient list
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
              <Button onClick={() => setShowAddForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </div>
            {showAddForm ? (
              <AddPatientForm
                onClose={() => setShowAddForm(false)}
                onAddPatient={handleAddPatient}
              />
            ) : (
              <>
                <PatientSearch onSearch={setSearchQuery} />
                <PatientList searchQuery={searchQuery} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
