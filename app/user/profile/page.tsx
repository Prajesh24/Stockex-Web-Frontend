"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const userDataStr = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (userDataStr) {
      const parsed = JSON.parse(decodeURIComponent(userDataStr));
      setUserData(parsed);
      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        username: parsed.username || "",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // TODO: Replace with actual API call to update user profile
      // const response = await axios.put(`/api/users/${userData?._id}`, formData);
      
      console.log("Profile update data:", formData);
      
      // For now, just show success message
      setMessage({
        type: "success",
        text: "Profile updated successfully! (This is a demo - actual API integration needed)",
      });

      // Update local userData
      if (userData) {
        setUserData({
          ...userData,
          name: formData.name,
          email: formData.email,
          username: formData.username,
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 py-8">
      <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Update your profile information</p>
          </div>

          {/* User Info Card */}
          {userData && (
            <div className="rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-white font-mono text-sm break-all">{userData._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white capitalize">{userData.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-white text-sm">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-white text-sm">
                    {new Date(userData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Update Form */}
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
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                             border border-white/10 focus:border-green-500
                             focus:ring-1 focus:ring-green-500 outline-none"
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
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg bg-black/40 px-4 text-sm text-white
                             border border-white/10 focus:border-green-500
                             focus:ring-1 focus:ring-green-500 outline-none"
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
                             border border-white/10 focus:border-green-500
                             focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600
                           hover:from-green-600 hover:to-emerald-700 disabled:opacity-50
                           text-white font-semibold rounded-lg transition-all mt-6"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => router.push("/home")}
                className="w-full h-11 bg-gray-800 hover:bg-gray-700
                           text-white font-semibold rounded-lg transition-all"
              >
                Back to Home
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
