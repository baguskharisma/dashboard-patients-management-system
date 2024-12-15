"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Patient {
  name: string;
  date: string;
  status: string;
}

export function RecentPatients() {
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("/api/recent-patients");
        const data = await response.json();
        setRecentPatients(
          data.map((patient: any) => ({
            name: `${patient.firstName} ${patient.lastName}`,
            date: new Date(patient.createdAt).toLocaleDateString(),
            status: "Completed", // You can modify status display if needed
          }))
        );
      } catch (error) {
        console.error("Error fetching recent patients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPatients.map((patient, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* <Avatar>
                <AvatarFallback>{patient.name[0]}</AvatarFallback>
              </Avatar> */}
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-500">{patient.date}</p>
              </div>
              <div className="ml-auto">
                <span className="text-sm font-medium text-blue-500">
                  {patient.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
