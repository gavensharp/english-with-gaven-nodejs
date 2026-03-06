"use client";

import { useState, useEffect, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { agoraConfig, fetchAgoraToken } from "@/lib/agora";

interface VideoCallProps {
  channelName: string;
  onLeave?: () => void;
}

export default function VideoCall({ channelName, onLeave }: VideoCallProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // Initialize Agora client
  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    // Set up event listeners
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        setRemoteUsers((prev) => [
          ...prev.filter((u) => u.uid !== user.uid),
          user,
        ]);
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      }
    });

    client.on("user-left", (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    return () => {
      client.removeAllListeners();
    };
  }, []);

  // Join channel
  const joinChannel = async () => {
    if (!clientRef.current || !agoraConfig.appId) {
      console.error("Agora client not initialized or App ID missing");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch token from backend
      const token = await fetchAgoraToken(channelName);

      // Create local tracks
      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      // Join channel
      await clientRef.current.join(agoraConfig.appId, channelName, token, null);

      // Publish local tracks
      await clientRef.current.publish([audioTrack, videoTrack]);

      setIsJoined(true);

      // Play local video after state update
      setTimeout(() => {
        if (localVideoRef.current && videoTrack) {
          videoTrack.play(localVideoRef.current);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to join channel:", error);
      alert("Failed to join video call. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Leave channel
  const leaveChannel = async () => {
    if (!clientRef.current) return;

    try {
      // Stop screen sharing if active
      if (isScreenSharing) {
        await stopScreenShare();
      }

      // Stop and close local tracks
      localAudioTrackRef.current?.stop();
      localAudioTrackRef.current?.close();
      localVideoTrackRef.current?.stop();
      localVideoTrackRef.current?.close();

      // Leave channel
      await clientRef.current.leave();

      setIsJoined(false);
      setRemoteUsers([]);

      // Call parent callback
      onLeave?.();
    } catch (error) {
      console.error("Failed to leave channel:", error);
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (!localAudioTrackRef.current) return;

    if (isAudioEnabled) {
      await localAudioTrackRef.current.setEnabled(false);
    } else {
      await localAudioTrackRef.current.setEnabled(true);
    }

    setIsAudioEnabled(!isAudioEnabled);
  };

  // Toggle video
  const toggleVideo = async () => {
    if (!localVideoTrackRef.current) return;

    if (isVideoEnabled) {
      await localVideoTrackRef.current.setEnabled(false);
    } else {
      await localVideoTrackRef.current.setEnabled(true);
    }

    setIsVideoEnabled(!isVideoEnabled);
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    console.log("🖥️ toggleScreenShare called, current state:", isScreenSharing);

    if (!isScreenSharing) {
      // Start screen sharing
      try {
        console.log("🖥️ Creating screen track...");
        const screenTrack = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "1080p_1",
          },
          "auto",
        );

        console.log("✅ Screen track created successfully:", screenTrack);
        console.log(
          "🔍 Screen track type:",
          typeof screenTrack,
          Array.isArray(screenTrack),
        );

        // createScreenVideoTrack can return a track or [videoTrack, audioTrack]
        const videoTrack = Array.isArray(screenTrack)
          ? screenTrack[0]
          : screenTrack;

        console.log("🎬 Video track:", videoTrack);
        screenTrackRef.current = videoTrack;

        // Replace camera with screen share (Agora doesn't allow multiple video tracks)
        if (clientRef.current && isJoined && localVideoTrackRef.current) {
          console.log("📥 Unpublishing camera before screen share...");
          await clientRef.current.unpublish(localVideoTrackRef.current);
          console.log("✅ Camera unpublished");

          console.log("📤 Publishing screen track...");
          await clientRef.current.publish(videoTrack);
          console.log("✅ Screen track published successfully!");
        }

        setIsScreenSharing(true);

        // Listen for when user stops sharing via browser UI
        videoTrack.on("track-ended", () => {
          console.log("🛑 Screen sharing ended by user");
          stopScreenShare();
        });
      } catch (error: any) {
        console.error("❌ Failed to create screen track:", {
          error,
          message: error?.message,
          code: error?.code,
          name: error?.name,
        });
        alert(
          `Failed to start screen sharing: ${error?.message || "Permission denied or screen sharing not supported"}`,
        );
      }
    } else {
      // Stop screen sharing
      await stopScreenShare();
    }
  };

  // Stop screen sharing helper
  const stopScreenShare = async () => {
    console.log("🛑 Stopping screen share...");
    if (screenTrackRef.current) {
      console.log("🔍 Cleaning up track:", screenTrackRef.current);
      try {
        // Unpublish screen track
        if (clientRef.current && isJoined) {
          console.log("📥 Unpublishing screen track...");
          await clientRef.current.unpublish(screenTrackRef.current);
          console.log("✅ Screen track unpublished");
        }

        // Stop and close the screen track
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
        console.log("✅ Screen track stopped and closed");

        // Re-publish camera
        if (clientRef.current && isJoined && localVideoTrackRef.current) {
          console.log("📤 Re-publishing camera...");
          await clientRef.current.publish(localVideoTrackRef.current);
          console.log("✅ Camera re-published");
        }
      } catch (error) {
        console.error("❌ Error cleaning up screen track:", error);
      }
      screenTrackRef.current = null;
      console.log("✅ Screen track cleaned up");
    }
    setIsScreenSharing(false);
  };

  // Play remote videos when users join
  useEffect(() => {
    remoteUsers.forEach((user) => {
      if (user.videoTrack && remoteVideoRef.current) {
        user.videoTrack.play(remoteVideoRef.current);
      }
    });
  }, [remoteUsers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Only cleanup if we're actually joined
      if (isJoined) {
        const cleanup = async () => {
          try {
            localAudioTrackRef.current?.stop();
            localAudioTrackRef.current?.close();
            localVideoTrackRef.current?.stop();
            localVideoTrackRef.current?.close();
            screenTrackRef.current?.stop();
            screenTrackRef.current?.close();
            await clientRef.current?.leave();
          } catch (error) {
            console.error("Cleanup error:", error);
          }
        };
        cleanup();
      }
    };
  }, [isJoined]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative flex-1 min-h-0">
        {/* Remote Video (Main View) */}
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 w-full h-full bg-gray-800 flex items-center justify-center">
          {remoteUsers.length === 0 && isJoined && (
            <div className="text-white text-center px-4">
              <p className="text-base sm:text-lg">
                Waiting for other participant...
              </p>
            </div>
          )}
          {!isJoined && (
            <div className="text-white text-center px-4">
              <p className="text-base sm:text-lg mb-4">Ready to join?</p>
              <button
                onClick={joinChannel}
                disabled={isLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                {isLoading ? "Joining..." : "Join Video Call"}
              </button>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        {isJoined && (
          <div
            ref={localVideoRef}
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white shadow-lg z-10"
            style={{ aspectRatio: "4/3" }}
          />
        )}
      </div>

      {/* Control Bar */}
      {isJoined && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
          {/* Microphone Button */}
          <button
            onClick={toggleAudio}
            className={`p-3 sm:p-4 rounded-full transition-all duration-200 transform hover:scale-110 ${
              isAudioEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            aria-label={isAudioEnabled ? "Mute" : "Unmute"}>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isAudioEnabled ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              )}
            </svg>
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleVideo}
            className={`p-3 sm:p-4 rounded-full transition-all duration-200 transform hover:scale-110 ${
              isVideoEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isVideoEnabled ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              )}
            </svg>
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            disabled={!isJoined}
            className={`p-3 sm:p-4 rounded-full transition-all duration-200 transform hover:scale-110 ${
              isScreenSharing
                ? "bg-accent-blue-dark hover:bg-blue-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isScreenSharing ? "Stop sharing" : "Share screen"}>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isScreenSharing ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              )}
            </svg>
          </button>

          {/* End Call Button */}
          <button
            onClick={leaveChannel}
            className="px-4 sm:px-8 py-2 sm:py-3 bg-red-600 hover:bg-red-700 rounded-full font-semibold text-white text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
              />
            </svg>
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      )}
    </div>
  );
}
