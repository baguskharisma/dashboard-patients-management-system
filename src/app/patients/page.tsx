"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { PatientList } from "@/components/patient-list";
import { PatientSearch } from "@/components/patient-search";

export default function PatientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Patients
            </h1>
            <PatientSearch onSearch={setSearchQuery} />
            <PatientList searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}
