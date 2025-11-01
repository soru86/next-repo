"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

interface Vessel {
  id: string;
  name: string;
  imo: string;
  flag: string;
  type: string;
  status: "ACTIVE" | "UNDER_MAINTENANCE";
}

export default function ReportIssue() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [formData, setFormData] = useState({
    vesselId: "",
    category: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchVessels();
    const vesselId = searchParams.get("vesselId");
    if (vesselId) {
      setFormData((prev) => ({ ...prev, vesselId }));
    }
  }, [searchParams]);

  const fetchVessels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/vessels/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVessels(data.vessels);
      }
    } catch (error) {
      console.error("Failed to fetch vessels:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/crew/issues");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to report issue");
      }
    } catch (error) {
      setError("Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Report Issue
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="vesselId"
                className="block text-sm font-medium text-gray-700"
              >
                Vessel
              </label>
              <select
                name="vesselId"
                id="vesselId"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.vesselId}
                onChange={handleChange}
              >
                <option value="">Select a vessel</option>
                {vessels.map((vessel) => (
                  <option key={vessel.id} value={vessel.id}>
                    {vessel.name} ({vessel.imo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                required
                placeholder="e.g., Engine, Navigation, Safety"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                name="priority"
                id="priority"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                required
                placeholder="Describe the issue in detail..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Reporting..." : "Report Issue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}



