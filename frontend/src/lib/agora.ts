/**
 * Agora Configuration and Utilities
 * Contains shared configuration and helper functions for Agora SDK
 */

export const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
  // Token will be fetched from API route for production
};

export const agoraChatConfig = {
  appKey: process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY || "",
  // Format should be: "orgName#appName" (e.g., "1234567890#myapp")
};

/**
 * Fetch RTC token from our backend API
 * @param channelName - The channel name to join
 * @param uid - User ID (0 for auto-assignment)
 * @returns Promise with token string
 */
export async function fetchAgoraToken(
  channelName: string,
  uid: string | number = 0,
): Promise<string> {
  try {
    const response = await fetch(
      `/api/agora/token?channel=${channelName}&uid=${uid}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Agora token");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching Agora token:", error);
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
