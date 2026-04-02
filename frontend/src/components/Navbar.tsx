"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import AuthButton from "./client/AuthButton";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Check if user is admin (you'll need to add role to your user context)
  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/site-images/logo.png"
              alt="English with Gaven Logo"
              width={80}
              height={80}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-grey-700 hover:text-accent-orange transition">
              Home
            </Link>
            <Link
              href="/about"
              className="text-grey-700 hover:text-accent-orange transition">
              About
            </Link>
            <Link
              href="/grammar"
              className="text-grey-700 hover:text-accent-orange transition">
              Grammar
            </Link>
            <Link
              href="/contact"
              className="text-grey-700 hover:text-accent-orange transition">
              Contact
            </Link>
            {/* <Link
              href="/calendar"
              className="text-grey-700 hover:text-accent-orange transition">
              Calendar
            </Link> */}

            {/* Admin Link - Only show for admin users */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-red-600 hover:text-red-700 font-semibold transition">
                Admin
              </Link>
            )}

            {/* Auth Button (shows Login/Signup OR Avatar) */}
            {/* <AuthButton /> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary"
            aria-label="Toggle menu">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col gap-4 pt-4">
              <Link
                href="/"
                className="text-grey-700 hover:text-accent-orange transition">
                Home
              </Link>
              <Link
                href="/about"
                className="text-grey-700 hover:text-accent-orange transition">
                About
              </Link>
              <Link
                href="/grammar"
                className="text-grey-700 hover:text-accent-orange transition">
                Grammar
              </Link>
              <Link
                href="/contact"
                className="text-grey-700 hover:text-accent-orange transition">
                Contact
              </Link>
              {/* <Link
                href="/calendar"
                className="text-grey-700 hover:text-accent-orange transition">
                Calendar
              </Link> */}

              {/* Admin Link - Mobile */}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-red-600 hover:text-red-700 font-semibold transition">
                  Admin
                </Link>
              )}

              {/* Auth Button for Mobile */}
              <div className="pt-4 border-t border-gray-200">
                {/* <AuthButton /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
