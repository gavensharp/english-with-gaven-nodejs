"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminCalendar from "@/components/calendar/AdminCalendar";
import { fetchWithAuth } from "@/lib/auth";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (loading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is admin by trying to fetch admin-only data
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Test admin access by calling an admin endpoint
        const response = await fetch("/api/lessons/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAdmin(true);

          // Fetch lessons and filter for upcoming ones
          const lessons = await response.json();
          const now = new Date();

          console.log("Admin Dashboard - Filtering lessons:", {
            totalLessons: lessons.length,
            currentTime: now.toISOString(),
            lessons: lessons.map((l: any) => ({
              id: l.id,
              status: l.status,
              startTime: l.startTime,
              endTime: l.endTime,
              studentId: l.studentId,
              student: l.student?.name,
            })),
          });

          // Show all upcoming lessons (not cancelled and end time is in the future)
          const upcoming = lessons.filter((lesson: any) => {
            const endTime = new Date(lesson.endTime);
            const isUpcoming = lesson.status !== "cancelled" && endTime > now;

            console.log(`Admin - Lesson ${lesson.id}:`, {
              status: lesson.status,
              startTime: lesson.startTime,
              endTime: endTime.toISOString(),
              now: now.toISOString(),
              notCancelled: lesson.status !== "cancelled",
              endInFuture: endTime > now,
              isUpcoming,
            });

            return isUpcoming;
          });

          console.log("Admin - Upcoming lessons found:", upcoming.length);

          // Sort by start time (earliest first)
          upcoming.sort(
            (a: any, b: any) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
          );

          setUpcomingLessons(upcoming);
        } else {
          alert("Access denied. Admin only.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/");
      } finally {
        setChecking(false);
      }
    };

    checkAdminAccess();

    // Refresh lessons every 30 seconds
    const interval = setInterval(() => {
      if (!loading && user) {
        checkAdminAccess();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-4xl font-bold text-primary-dark mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user?.name}! Manage lesson schedules and bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Quick Stats
              </h3>
              <p className="text-3xl font-bold text-blue-600">-</p>
              <p className="text-sm text-gray-500">Total Lessons</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Booked
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {upcomingLessons.length}
              </p>
              <p className="text-sm text-gray-500">Upcoming Bookings</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Available
              </h3>
              <p className="text-3xl font-bold text-gray-600">-</p>
              <p className="text-sm text-gray-500">Open Slots</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => (window.location.href = "/admin/users")}
                className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left">
                <div className="text-4xl">👥</div>
                <div>
                  <h3 className="font-semibold text-lg text-blue-900">
                    Manage Students
                  </h3>
                  <p className="text-sm text-blue-700">
                    View all registered students and their details
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  window.location.href = `/session`;
                }}
                className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-left cursor-pointer">
                <div className="text-4xl">🎓</div>
                <div>
                  <h3 className="font-semibold text-lg text-green-900">
                    Test Video Call
                  </h3>
                  <p className="text-sm text-green-700">
                    Go to test session page (select User 1 for Tutor)
                  </p>
                </div>
              </button>
            </div>
          </div>

          <AdminCalendar />
        </div>
      </div>
    </div>
  );
}
