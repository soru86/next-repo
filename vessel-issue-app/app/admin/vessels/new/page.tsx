"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default function NewVessel() {
  const [formData, setFormData] = useState({
    name: "",
    imo: "",
    flag: "",
    type: "",
    lastInspectionDate: "",
    assignedToUserId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [crew, setCrew] = useState<{ id: string; email: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadCrew = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/crew", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCrew(data.users);
        }
      } catch (e) {
        // noop
      }
    };
    loadCrew();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/vessels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/vessels");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create vessel");
      }
    } catch (error) {
      setError("Failed to create vessel");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
            Add New Vessel
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Vessel Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="assignedToUserId"
                className="block text-sm font-medium text-gray-700"
              >
                Assign To (Crew)
              </label>
              <select
                name="assignedToUserId"
                id="assignedToUserId"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.assignedToUserId}
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {crew.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="imo"
                className="block text-sm font-medium text-gray-700"
              >
                IMO Number
              </label>
              <input
                type="text"
                name="imo"
                id="imo"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.imo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="flag"
                className="block text-sm font-medium text-gray-700"
              >
                Flag
              </label>
              <input
                type="text"
                name="flag"
                id="flag"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.flag}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Vessel Type
              </label>
              <input
                type="text"
                name="type"
                id="type"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.type}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="lastInspectionDate"
                className="block text-sm font-medium text-gray-700"
              >
                Last Inspection Date
              </label>
              <input
                type="date"
                name="lastInspectionDate"
                id="lastInspectionDate"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.lastInspectionDate}
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
                {loading ? "Creating..." : "Create Vessel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
