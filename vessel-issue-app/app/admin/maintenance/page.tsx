"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function MaintenanceScan() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    updatedVessels: number;
  } | null>(null);
  const [error, setError] = useState("");

  const runMaintenanceScan = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/jobs/maintenance-scan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to run maintenance scan");
      }
    } catch (error) {
      setError("Failed to run maintenance scan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Maintenance Scan
          </h1>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                What does this do?
              </h2>
              <p className="text-sm text-gray-600">
                The maintenance scan checks all vessels and automatically
                updates their status:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>
                  Vessels with 3 or more open issues → Status: UNDER_MAINTENANCE
                </li>
                <li>Vessels with fewer than 3 open issues → Status: ACTIVE</li>
              </ul>
            </div>

            <div className="mb-6">
              <button
                onClick={runMaintenanceScan}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Running Scan..." : "Run Maintenance Scan"}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">
                  {result.message}. Updated {result.updatedVessels} vessels.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


