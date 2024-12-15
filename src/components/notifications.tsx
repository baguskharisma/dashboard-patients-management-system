"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface Notification {
  id: string;
  message: string;
  date: string;
}

// This would typically come from an API or state management system
const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "New appointment scheduled",
    date: "2023-06-15 10:00 AM",
  },
  { id: "2", message: "Patient record updated", date: "2023-06-14 2:30 PM" },
  {
    id: "3",
    message: "Prescription renewal request",
    date: "2023-06-13 11:15 AM",
  },
];

export function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 text-xs w-5 h-5 flex justify-center items-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className="flex flex-col items-start py-2"
            >
              <div className="flex justify-between w-full">
                <span className="font-medium">{notif.message}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notif.id)}
                >
                  Mark as read
                </Button>
              </div>
              <span className="text-sm text-gray-500">{notif.date}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
