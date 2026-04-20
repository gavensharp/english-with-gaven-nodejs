/**
 * Agora Configuration and Utilities
 * Contains shared configuration and helper functions for Agora SDK
 */

const backendUrl = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
).replace(/\/$/, "");
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${backendUrl}/api`;

export const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
  // Token will be fetched from backend API for production
};

export const agoraChatConfig = {
  appKey: process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY || "",
  // Format should be: "orgName#appName" (e.g., "1234567890#myapp")
};

/**
 * Fetch RTC token from backend Express server
 * @param channelName - The channel name to join
 * @param uid - User ID (0 for auto-assignment)
 * @param role - User role: 'publisher' or 'subscriber' (defaults to 'publisher')
 * @returns Promise with token data including token string, expiration, etc.
 */
export async function fetchAgoraToken(
  channelName: string,
  uid: string | number = 0,
  role: "publisher" | "subscriber" = "publisher",
): Promise<string> {
  try {
    // Get auth token from localStorage if available
    const authToken = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/agora/rtc/token?channelName=${channelName}&uid=${uid}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch Agora token: ${response.status}`,
      );
    }

    const data = await response.json();

    if (!data.success || !data.data?.token) {
      throw new Error("Invalid token response from server");
    }

    // Return just the token string for backwards compatibility
    return data.data.token;
  } catch (error) {
    console.error("Error fetching Agora token:", error);
    throw error;
  }
}

/**
 * Fetch RTC token with full response data
 * @param channelName - The channel name to join
 * @param uid - User ID (0 for auto-assignment)
 * @param role - User role: 'publisher' or 'subscriber'
 * @returns Promise with complete token data
 */
export async function fetchAgoraTokenData(
  channelName: string,
  uid: string | number = 0,
  role: "publisher" | "subscriber" = "publisher",
): Promise<{
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  role: string;
  expiresIn: number;
  expiresAt: string;
}> {
  try {
    const authToken = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/agora/rtc/token?channelName=${channelName}&uid=${uid}&role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch Agora token: ${response.status}`,
      );
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error("Invalid token response from server");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching Agora token data:", error);
    throw error;
  }
}

/**
 * Renew RTC token before expiration
 * @param channelName - The channel name
 * @param uid - User ID
 * @param role - User role
 * @returns Promise with new token string
 */
export async function renewAgoraToken(
  channelName: string,
  uid: string | number = 0,
  role: "publisher" | "subscriber" = "publisher",
): Promise<string> {
  try {
    const authToken = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/agora/rtc/token/renew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({ channelName, uid, role }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to renew Agora token: ${response.status}`,
      );
    }

    const data = await response.json();

    if (!data.success || !data.data?.token) {
      throw new Error("Invalid token response from server");
    }

    return data.data.token;
  } catch (error) {
    console.error("Error renewing Agora token:", error);
    throw error;
  }
}

/**
 * Fetch RTM token for real-time messaging
 * @param userId - User ID for RTM
 * @returns Promise with token string
 */
export async function fetchAgoraRtmToken(userId: string): Promise<string> {
  try {
    const authToken = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/agora/rtm/token?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch RTM token: ${response.status}`,
      );
    }

    const data = await response.json();

    if (!data.success || !data.data?.token) {
      throw new Error("Invalid RTM token response from server");
    }

    return data.data.token;
  } catch (error) {
    console.error("Error fetching Agora RTM token:", error);
    throw error;
  }
}

/**
 * Validate Agora configuration
 * @returns boolean indicating if config is valid
 */
export function isAgoraConfigValid(): boolean {
  return !!agoraConfig.appId;
}
