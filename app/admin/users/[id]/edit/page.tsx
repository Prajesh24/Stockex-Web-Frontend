"use client";

import ProtectedAdminRoute from "@/app/_components/ProtectedAdminRoute";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    role: "user",
  });

  useEffect(() => {
    // TODO: Fetch user from API using userId
    // For now, using dummy data
    const dummyUser: UserDetail = {
      _id: userId,
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      role: "user",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T15:45:00Z",
    };
    setUser(dummyUser);
    setFormData({
      name: dummyUser.name,
      email: dummyUser.email,
      username: dummyUser.username || "",
      role: dummyUser.role,
    });
    setLoading(false);
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      // TODO: Replace with actual API call to update user
      // const response = await axios.put(`/api/users/${userId}`, formData);
      
      console.log("User update data:", formData);
      
      setMessage({
        type: "success",
        text: "User updated successfully! (This is a demo - actual API integration needed)",
      });

      // Update local user data
      if (user) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email,
          username: formData.username,
          role: formData.role,
        });
      }

      // Redirect after success
      setTimeout(() => {
        router.push(`/admin/users/${userId}`);
      }, 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update user",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ProtectedAdminRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="text-white">Loading user details...</div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedAdminRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="text-white">User not found</div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Edit User</h1>
            <p className="text-gray-400">Update user information for {user.name}</p>
          </div>

          {/* Edit Form */}
          <div className="rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-500/20 border border-green-500 text-green-200"
                    : "bg-red-500/20 border border-red-500 text-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID (Read-only) */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">User ID</label>
                <input
                  type="text"
                  value={user._id}
                  disabled
                  className="h-11 w-full rounded-lg bg-gray-800 px-4 text-sm text-gray-400
                             border border-white/10 outline-none cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                             border border-white/10 focus:border-yellow-500
                             focus:ring-1 focus:ring-yellow-500 outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                             border border-white/10 focus:border-yellow-500
                             focus:ring-1 focus:ring-yellow-500 outline-none"
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                             border border-white/10 focus:border-yellow-500
                             focus:ring-1 focus:ring-yellow-500 outline-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                             border border-white/10 focus:border-yellow-500
                             focus:ring-1 focus:ring-yellow-500 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Account Info (Read-only) */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-3">Account Information</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="text-gray-300">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-11 bg-gradient-to-r from-yellow-500 to-yellow-600
                             hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50
                             text-white font-semibold rounded-lg transition-all"
                >
                  {updating ? "Updating..." : "Update User"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/users/${userId}`)}
                  className="flex-1 h-11 bg-gray-800 hover:bg-gray-700
                             text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
