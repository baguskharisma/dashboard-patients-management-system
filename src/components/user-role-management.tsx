"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  name: string;
  email: string;
  role: "doctor" | "super_admin";
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    role: "doctor",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "super_admin",
  },
  {
    id: 3,
    name: "Dr. Alice Johnson",
    email: "alice.johnson@example.com",
    role: "doctor",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob.brown@example.com",
    role: "super_admin",
  },
  {
    id: 5,
    name: "Dr. Charlie Davis",
    email: "charlie.davis@example.com",
    role: "doctor",
  },
];

export function UserRoleManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (
    userId: number,
    newRole: "doctor" | "super_admin"
  ) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <Label htmlFor="search">Search Users</Label>
        <Input
          id="search"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value: "doctor" | "super_admin") =>
                    handleRoleChange(user.id, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor (Admin)</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
