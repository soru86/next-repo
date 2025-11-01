"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

interface Recommendation {
  id: string;
  category: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "RESOLVED";
  createdAt: string;
  vessel: {
    id: string;
    name: string;
    imo: string;
    type: string;
  };
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category");
    const vesselType = searchParams.get("vesselType");

    if (category || vesselType) {
      fetchRecommendations(category, vesselType);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchRecommendations = async (
    category: string | null,
    vesselType: string | null
  ) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (vesselType) params.append("vesselType", vesselType);

      const response = await fetch(`/api/issues/recommend?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    switch (priority) {
      case "HIGH":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "MEDIUM":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "LOW":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">Loading recommendations...</div>
        </div>
      </DashboardLayout>
    );
  }

  const category = searchParams.get("category");
  const vesselType = searchParams.get("vesselType");

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Issue Recommendations
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Similar resolved issues for {category && `category "${category}"`}{" "}
              {category && vesselType && "and"}{" "}
              {vesselType && `vessel type "${vesselType}"`}
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
            No similar resolved issues found
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {rec.category}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {rec.description}
                    </p>
                    <div className="mt-4 flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Vessel: {rec.vessel.name} ({rec.vessel.imo})
                      </span>
                      <span className="text-sm text-gray-500">
                        Type: {rec.vessel.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        Resolved: {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={getPriorityBadge(rec.priority)}>
                      {rec.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}



