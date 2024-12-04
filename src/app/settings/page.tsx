"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { UserRoleManagement } from "@/components/user-role-management";
import { AddUserForm } from "@/components/add-user-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Settings
            </h1>
            <Tabs defaultValue="roles" className="w-full">
              <TabsList>
                <TabsTrigger value="roles">User Roles</TabsTrigger>
                <TabsTrigger value="add-user">Add User</TabsTrigger>
              </TabsList>
              <TabsContent value="roles">
                <UserRoleManagement />
              </TabsContent>
              <TabsContent value="add-user">
                <AddUserForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
