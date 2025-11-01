"use client";

import { useAuth } from "@/contexts/auth-context";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-gray-200 rounded-lg h-96 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Vessel Issue Reporting System
          </h1>
          <p className="text-gray-600 mb-6">
            You are logged in as: <strong>{user.email}</strong> ({user.role})
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}



