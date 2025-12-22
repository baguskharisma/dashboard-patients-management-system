"use client";

import { useState, useEffect } from "react";

interface UserRole {
  roleId: number | null;
  isDoctor: boolean;
  canEditRecords: boolean;
  canManagePrescriptions: boolean;
}

export function useAuth(): UserRole {
  const [userRole, setUserRole] = useState<UserRole>({
    roleId: null,
    isDoctor: false,
    canEditRecords: false,
    canManagePrescriptions: false,
  });

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch("/api/auth/me");
        
        if (response.ok) {
          const data = await response.json();
          setUserRole({
            roleId: data.roleId,
            isDoctor: data.isDoctor,
            canEditRecords: data.canEditRecords,
            canManagePrescriptions: data.canManagePrescriptions,
          });
        } else {
          // User not authenticated
          setUserRole({
            roleId: null,
            isDoctor: false,
            canEditRecords: false,
            canManagePrescriptions: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user role", error);
        setUserRole({
          roleId: null,
          isDoctor: false,
          canEditRecords: false,
          canManagePrescriptions: false,
        });
      }
    }

    fetchUserRole();
  }, []);

  return userRole;
}
