"use client";

import { Bell, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notifications } from "./notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call logout API to invalidate token server-side
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // Important for handling cookies
      });

      if (response.ok) {
        // Clear local storage and session-related data
        localStorage.removeItem("user");

        // Remove the token cookie
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Show success toast and redirect
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });

        // Redirect to login page
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b lg:px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800 lg:text-2xl">
          Patient Management
        </h1>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-4">
        <Notifications />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault(); // Prevent default dropdown close
                handleLogout();
              }}
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoading ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
