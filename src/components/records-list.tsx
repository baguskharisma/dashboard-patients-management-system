"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Record {
  id: number;
  patientName: string;
  dateOfBirth: string;
  lastVisit: string;
}

const initialRecords: Record[] = [
  {
    id: 1,
    patientName: "John Doe",
    dateOfBirth: "1980-05-15",
    lastVisit: "2023-05-01",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    dateOfBirth: "1992-08-22",
    lastVisit: "2023-04-28",
  },
  {
    id: 3,
    patientName: "Alice Johnson",
    dateOfBirth: "1975-11-30",
    lastVisit: "2023-05-03",
  },
  {
    id: 4,
    patientName: "Bob Brown",
    dateOfBirth: "1988-02-14",
    lastVisit: "2023-04-15",
  },
  {
    id: 5,
    patientName: "Charlie Davis",
    dateOfBirth: "1995-07-07",
    lastVisit: "2023-05-02",
  },
];

interface RecordsListProps {
  onSelectRecord: (id: number) => void;
}

export function RecordsList({ onSelectRecord }: RecordsListProps) {
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");

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
