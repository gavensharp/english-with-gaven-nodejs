"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth";
import Image from "next/image";

interface Lesson {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  availabilitySlot: {
    startTime: string;
    endTime: string;
  } | null;
}

interface UserDetails {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_photo?: string;
  dob?: string;
  gender?: string;
  country?: string;
  timezone?: string;
  english_level?: string;
  lessons: Lesson[];
  stats: {
    totalLessons: number;
    upcomingLessons: number;
    completedLessons: number;
    cancelledLessons: number;
  };
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "lessons">("profile");

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetchWithAuth(`/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to load user details");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {user.profile_photo ? (
                    <Image
                      src={`/uploads/profile_photo/${user.profile_photo}`}
                      alt={user.name}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-primary-dark mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 mb-1">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => router.push("/admin/users")}
                className="btn btn-outline-primary">
                ← Back to Users
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-600 mb-1">Total Lessons</div>
              <div className="text-3xl font-bold text-primary-dark">
                {user.stats.totalLessons}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-md p-6">
              <div className="text-sm text-blue-600 mb-1">Upcoming</div>
              <div className="text-3xl font-bold text-blue-700">
                {user.stats.upcomingLessons}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg shadow-md p-6">
              <div className="text-sm text-green-600 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-700">
                {user.stats.completedLessons}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg shadow-md p-6">
              <div className="text-sm text-red-600 mb-1">Cancelled</div>
              <div className="text-3xl font-bold text-red-700">
                {user.stats.cancelledLessons}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === "profile"
                      ? "border-primary-dark text-primary-dark"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === "lessons"
                      ? "border-primary-dark text-primary-dark"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                  Lessons History
                </button>
              </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Full Name
                    </label>
                    <div className="text-lg font-medium">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Email Address
                    </label>
                    <div className="text-lg font-medium">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      English Level
                    </label>
                    <div className="text-lg font-medium">
                      {user.english_level || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Country
                    </label>
                    <div className="text-lg font-medium">
                      {user.country || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Date of Birth
                    </label>
                    <div className="text-lg font-medium">
                      {user.dob
                        ? new Date(user.dob).toLocaleDateString()
                        : "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Gender
                    </label>
                    <div className="text-lg font-medium capitalize">
                      {user.gender || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Timezone
                    </label>
                    <div className="text-lg font-medium">
                      {user.timezone || "Not set"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Account Role
                    </label>
                    <div className="text-lg font-medium capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lessons Tab */}
            {activeTab === "lessons" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Lessons History</h2>
                {user.lessons.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No lessons booked yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lesson.status)}`}>
                                {lesson.status.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600">
                                {Math.round(
                                  (new Date(lesson.endTime).getTime() -
                                    new Date(lesson.startTime).getTime()) /
                                    60000,
                                )}{" "}
                                minutes
                              </span>
                            </div>
                            <div className="text-lg font-medium mb-1">
                              📅{" "}
                              {lesson.availabilitySlot
                                ? new Date(
                                    lesson.availabilitySlot.startTime,
                                  ).toLocaleString()
                                : new Date(lesson.startTime).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Booked on:{" "}
                              {new Date(lesson.createdAt).toLocaleDateString()}
                            </div>
                            {lesson.notes && (
                              <div className="mt-2 text-sm text-gray-700">
                                📝 {lesson.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
