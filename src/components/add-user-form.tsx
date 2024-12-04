"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewUser {
  name: string;
  email: string;
  role: "doctor" | "super_admin";
  password: string;
}

export function AddUserForm() {
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "doctor",
    password: "",
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("New user:", newUser);
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${
        newUser.role === "doctor" ? "Doctor (Admin)" : "Super Admin"
      }.`,
    });
    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "doctor",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={newUser.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={newUser.role}
          onValueChange={(value: "doctor" | "super_admin") =>
            setNewUser((prev) => ({ ...prev, role: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="doctor">Doctor (Admin)</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={newUser.password}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Add User</Button>
    </form>
  );
}
