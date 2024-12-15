"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Record {
  id: number;
  patientName: string;
  dateOfBirth: string;
  lastVisit: string;
}

interface RecordsListProps {
  onSelectRecord: (id: number) => void;
}

export function RecordsList({ onSelectRecord }: RecordsListProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch records from the API when the component mounts
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("/api/records");
        if (!res.ok) {
          throw new Error("Failed to fetch records");
        }
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  // Filter records based on search term
  const filteredRecords = records.filter((record) =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <Label htmlFor="search">Search Records</Label>
        <Input
          id="search"
          placeholder="Search by patient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {filteredRecords.map((record) => (
          <Button
            key={record.id}
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => onSelectRecord(record.id)}
          >
            <div className="flex justify-between w-full">
              <div className="font-medium">{record.patientName}</div>
              <div className="text-sm text-gray-500">
                Last visit: {record.lastVisit}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
