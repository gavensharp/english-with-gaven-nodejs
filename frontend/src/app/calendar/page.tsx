"use client";

import StudentCalendar from "@/components/calendar/StudentCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated (optional - you can allow guests to view)
    if (!loading && !user) {
      // Uncomment below if you want to require login
      // router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-dark mb-4">
              Book Your English Lesson
            </h1>
            <p className="text-lg text-gray-600">
              {user
                ? "Click on an available time slot to book your lesson (30 or 60 minutes). Availability based on Jakarta time zone."
                : "Log in to book lessons or view available time slots below"}
            </p>
          </div>

          <StudentCalendar readOnly={!user} />

          {!user && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Want to book a lesson? Sign up or log in to get started!
              </p>
              <div className="flex justify-center gap-4">
                <a href="/signup" className="btn btn-primary">
                  Sign Up
                </a>
                <a href="/login" className="btn btn-outline-primary">
                  Log In
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
