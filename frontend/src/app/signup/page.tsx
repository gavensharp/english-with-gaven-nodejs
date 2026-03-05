import type { Metadata } from "next";
import SignupForm from "@/components/client/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up - Create Your Account | English with Gaven",
  description:
    "Create your account to start learning English with Gaven. Get personalized lessons and track your progress.",
  keywords:
    "signup, register, create account, English lessons, online tutoring",
};

export default function Signup() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark mb-3">
            Start Your English Learning Journey
          </h1>
          <p className="text-lg text-gray-700">
            Create your account and get started with personalized English
            lessons
          </p>
        </div>

        {/* Signup Form (Client Component) */}
        <SignupForm />
      </div>
    </main>
  );
}
