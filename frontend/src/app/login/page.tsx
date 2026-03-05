import type { Metadata } from "next";
import LoginForm from "@/components/client/LoginForm";

export const metadata: Metadata = {
  title: "Login - Access Your Account | English with Gaven",
  description:
    "Login to your English with Gaven account to access your lessons, track progress, and manage your profile.",
  keywords: "login, signin, student login, English lessons, online tutoring",
};

export default function Login() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark mb-3">
            Login to Your Account
          </h1>
          <p className="text-lg text-gray-700">
            Access your personalized English lessons and track your progress
          </p>
        </div>

        {/* Login Form (Client Component) */}
        <LoginForm />
      </div>
    </main>
  );
}
