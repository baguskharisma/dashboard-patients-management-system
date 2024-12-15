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
  role: "Doctor" | "Admin";
  password: string;
}

export function AddUserForm() {
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "Doctor",
    password: "",
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to add user",
          variant: "destructive",
        });
        return;
      }

      const createdUser = await response.json();
      toast({
        title: "User Added",
        description: `${createdUser.name} has been added as a ${createdUser.role}.`,
      });

      // Reset form
      setNewUser({
        name: "",
        email: "",
        role: "Doctor",
        password: "",
      });
    } catch (error) {
      console.error("Error parsing response:", error);
      toast({
        title: "Error",
        description: "Failed to parse response.",
        variant: "destructive",
      });
    }
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
          onValueChange={(value: "Doctor" | "Admin") =>
            setNewUser((prev) => ({ ...prev, role: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Doctor">Doctor</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
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
