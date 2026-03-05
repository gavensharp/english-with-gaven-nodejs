"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthButton() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Show nothing while loading
  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <a href="/login" className="btn btn-outline-primary">
          Login
        </a>
        <a href="/signup" className="btn btn-primary">
          Sign Up
        </a>
      </div>
    );
  }

  // Determine dashboard URL based on user role
  const dashboardUrl =
    user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:inline font-semibold">{user.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <a
            href={dashboardUrl}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Dashboard
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

