"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Import VideoCall with no SSR to avoid "window is not defined" error
const VideoCall = dynamic(() => import("@/components/agora/VideoCall"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
      <p className="text-white">Loading video call...</p>
    </div>
  ),
});

// Import ChatPanel with no SSR
const ChatPanel = dynamic(() => import("@/components/agora/ChatPanel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading chat...</p>
    </div>
  ),
});

export default function SessionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chatClient, setChatClient] = useState<any>(null);
  const chatClientRef = useRef<any>(null);

  // For testing, use a default channel name
  // In production, this would come from your lesson/session booking system
  const channelName = "test-session-1";

  /// Initialize Agora Chat client
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const AC = await import("agora-chat");

        // Use environment variable instead of hardcoded value
        const appKey = process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY;

        console.log("🔵 [Chat] Initializing Agora Chat client...");
        console.log("🔵 [Chat] AppKey from env:", appKey);
        console.log("🔵 [Chat] AppKey type:", typeof appKey);
        console.log("🔵 [Chat] AppKey length:", appKey?.length);

        if (!appKey) {
          throw new Error(
            "❌ NEXT_PUBLIC_AGORA_CHAT_APP_KEY not found in .env.local",
          );
        }

        // Ensure appKey is a string and trim any whitespace
        const cleanAppKey = String(appKey).trim();
        console.log("🔵 [Chat] Clean AppKey:", cleanAppKey);

        const client = new AC.default.connection({
          appKey: cleanAppKey,
        });

        chatClientRef.current = client;
        setChatClient(client);

        console.log("✅ [Chat] Client created successfully");
      } catch (error) {
        console.error("❌ [Chat] Failed to create client:", error);
      }
    };

    initializeChat();

    return () => {
      console.log("🔵 [Chat] Cleaning up chat client");
    };
  }, []);

  const handleLeave = () => {
    // Route users back to their respective dashboards based on role
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user?.role === "student") {
      router.push("/student/dashboard");
    } else {
      // Fallback to home if role is not set
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            V-Classroom
          </h1>
          <button
            onClick={handleLeave}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800">
            ← Back to Home
          </button>
        </div>

        {/* Video and Chat Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 max-h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)]">
          {/* Video Section - Takes 2/3 of space on large screens */}
          <div className="lg:col-span-2 h-[50vh] lg:h-full min-h-[350px] max-h-[600px] lg:max-h-none">
            <VideoCall channelName={channelName} onLeave={handleLeave} />
          </div>

          {/* Chat Section - Takes 1/3 of space on large screens */}
          <div className="lg:col-span-1 h-[30vh] lg:h-full min-h-[250px] max-h-[400px] lg:max-h-none mb-4 lg:mb-0">
            <ChatPanel
              chatClient={chatClient}
              channelName={channelName}
              userRole={user?.role}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
