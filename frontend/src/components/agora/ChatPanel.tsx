"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatPanelProps {
  chatClient?: any; // Agora Chat client instance
  channelName: string;
  userName?: string;
  userRole?: string;
}

// Type for Agora Chat SDK
let AgoraChat: any = null;

export default function ChatPanel({
  chatClient,
  channelName,
  userName = "User",
  userRole,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat connection
  useEffect(() => {
    if (!chatClient) {
      console.log("⏳ [ChatPanel] Waiting for chat client...");
      return;
    }

    const initChat = async () => {
      try {
        console.log("🔵 [ChatPanel] Initializing chat...");

        // Import Agora Chat SDK
        if (!AgoraChat) {
          const AC = await import("agora-chat");
          AgoraChat = AC.default;
          console.log("✅ [ChatPanel] Agora Chat SDK loaded");
        }

        // Determine user ID and token based on role
        const isAdmin = userRole === "admin";
        const userId = isAdmin ? "user1" : "user2";
        const token = isAdmin
          ? process.env.NEXT_PUBLIC_AGORA_CHAT_USER1_TOKEN
          : process.env.NEXT_PUBLIC_AGORA_CHAT_USER2_TOKEN;

        console.log("🔵 [ChatPanel] Role:", userRole);
        console.log("🔵 [ChatPanel] User ID:", userId);
        console.log("🔵 [ChatPanel] Token exists:", !!token);
        console.log("🔵 [ChatPanel] Token length:", token?.length);

        if (!token) {
          throw new Error(
            `Token not found for ${isAdmin ? "admin" : "student"}`,
          );
        }

        // Open connection with token
        await chatClient.open({
          user: userId,
          accessToken: token,
        });

        console.log("✅ [ChatPanel] Connected successfully");
        setIsConnected(true);

        // Listen for incoming messages
        chatClient.addEventHandler("chatHandler", {
          onTextMessage: (message: any) => {
            console.log("📨 [ChatPanel] Received message:", message);

            const newMessage: Message = {
              id: message.id,
              sender: message.from,
              text: message.msg,
              timestamp: new Date(message.time),
              isOwn: false,
            };

            setMessages((prev) => [...prev, newMessage]);
          },
          onError: (error: any) => {
            console.error("❌ [ChatPanel] Error details:", {
              error,
              errorType: typeof error,
              errorString: String(error),
              errorJSON: JSON.stringify(error, null, 2),
              errorMessage: error?.message,
              errorCode: error?.code,
              errorData: error?.data,
            });
            setError("Connection error");
          },
        });
      } catch (err: any) {
        console.error("❌ [ChatPanel] Failed to connect:", {
          err,
          errType: typeof err,
          errString: String(err),
          errMessage: err?.message,
          errCode: err?.code,
          errData: err?.data,
          errStack: err?.stack,
        });
        setError(err.message || "Failed to connect to chat");
      }
    };

    initChat();

    return () => {
      if (chatClient && isConnected) {
        console.log("🔵 [ChatPanel] Disconnecting...");
        chatClient.close();
      }
    };
  }, [chatClient]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatClient || !isConnected || !AgoraChat) return;

    try {
      // Determine recipient based on role (peer-to-peer chat)
      const isAdmin = userRole === "admin";
      const recipientId = isAdmin ? "user2" : "user1"; // Send to the other user

      // Create message using AgoraChat SDK for single chat (peer-to-peer)
      const message = AgoraChat.message.create({
        type: "txt",
        msg: inputText,
        to: recipientId,
        chatType: "singleChat", // Changed from groupChat to singleChat
      });

      console.log("📤 [ChatPanel] Sending message to:", recipientId, message);

      // Send message
      const result = await chatClient.send(message);

      console.log("✅ [ChatPanel] Message sent, result:", result);

      // Add to local messages
      const newMessage: Message = {
        id: result?.id || message.id,
        sender: userName,
        text: inputText,
        timestamp: new Date(),
        isOwn: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
    } catch (err: any) {
      console.error("❌ [ChatPanel] Failed to send message:", {
        err,
        errType: typeof err,
        errMessage: err?.message,
        errCode: err?.code,
        errType2: err?.type,
        errData: err?.data,
        stack: err?.stack,
      });
      setError("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Chat</h3>
        <p className="text-xs text-gray-500">
          {isConnected ? "✅ Connected" : "⏳ Connecting..."}
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.isOwn
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {!message.isOwn && (
                <p className="text-xs font-semibold mb-1">{message.sender}</p>
              )}
              <p className="text-sm">{message.text}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || !isConnected}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
