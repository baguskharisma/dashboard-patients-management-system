"use client";

import { useState, useEffect } from "react";
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
  isRead: boolean;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Ambil notifikasi dari API yang berisi appointment hari ini
    const fetchNotifications = async () => {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Notification updated:", result);

        // Perbarui state setelah berhasil
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
      } else {
        console.error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.some((notif) => !notif.isRead) && (
            <Badge className="absolute -top-1 -right-1 text-xs w-5 h-5 flex justify-center items-center">
              {notifications.filter((notif) => !notif.isRead).length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className={`flex flex-col items-start py-2 ${
                notif.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex justify-between w-full">
                <span className="font-medium">{notif.message}</span>
                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
              <span className="text-sm text-gray-500">{notif.date}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No new appointments today
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
