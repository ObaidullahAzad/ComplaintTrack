"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    if (!user?.role || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchComplaints();
  }, [user, router]);

  const fetchComplaints = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/admin/complaints?${queryParams}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch complaints");
      }

      setComplaints(data.complaints);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh complaints list
      fetchComplaints();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const deleteComplaint = async (complaintId: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete complaint");
      }

      // Refresh complaints list after successful deletion
      fetchComplaints();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const filteredComplaints = complaints.filter((complaint) => {
    if (filters.status && complaint.status !== filters.status) return false;
    if (filters.priority && complaint.priority !== filters.priority)
      return false;
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          className="border rounded-md px-3 py-2"
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            fetchComplaints();
          }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          className="border rounded-md px-3 py-2"
          value={filters.priority}
          onChange={(e) => {
            setFilters({ ...filters, priority: e.target.value });
            fetchComplaints();
          }}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Complaints Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {complaint.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {complaint.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {complaint.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-sm ${getPriorityColor(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      updateStatus(complaint._id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/complaints/${complaint._id}`)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => deleteComplaint(complaint._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
