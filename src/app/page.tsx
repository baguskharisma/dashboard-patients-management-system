"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, UserCheck, Activity } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { StatCard } from "@/components/stat-card";
import { RecentPatients } from "@/components/recent-patients";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stat"); // Pastikan endpoint benar
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <h3 className="text-gray-700 text-2xl font-medium mb-4 lg:text-3xl">
              Dashboard
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Patients"
                value={stats.totalPatients.toLocaleString()}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="New Patients"
                value={stats.newPatients.toLocaleString()}
                icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Appointments"
                value={stats.appointments.toLocaleString()}
                icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="mt-6 lg:mt-8">
              <RecentPatients />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
