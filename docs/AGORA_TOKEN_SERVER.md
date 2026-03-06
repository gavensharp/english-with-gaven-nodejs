# Agora Token Server Implementation

This implementation provides a robust, automated token server for Agora RTC (video/audio) and RTM (messaging) services.

## Overview

The token server runs on your Express backend and automatically generates fresh Agora tokens whenever clients need them. This eliminates the need for manual token updates and provides better security and scalability.

## Features

✅ **Automatic Token Generation** - Tokens are generated on-demand for each client request
✅ **24-Hour Token Validity** - Tokens expire after 24 hours for security
✅ **Multiple Token Types** - Supports both RTC (video/audio) and RTM (real-time messaging) tokens
✅ **Token Renewal** - Clients can renew tokens before expiration
✅ **Role-Based Access** - Support for publisher (can send/receive) and subscriber (receive only) roles
✅ **Authentication Ready** - Integrated with your existing auth middleware (optional)

## Setup Instructions

### 1. Environment Variables

Add these to your backend `.env` file:

```env
AGORA_APP_ID="your-agora-app-id"
AGORA_APP_CERTIFICATE="your-agora-app-certificate"
```

Get your credentials from: https://console.agora.io/

### 2. Backend Setup (Already Done)

The following have been automatically set up:

- ✅ Installed `agora-token` package
- ✅ Created `agoraController.ts` with token generation logic
- ✅ Created `agora.ts` routes
- ✅ Registered routes in `server.ts`

### 3. Frontend Setup (Already Done)

Updated `lib/agora.ts` to fetch tokens from backend Express server instead of Next.js API routes.

## API Endpoints

### Generate RTC Token (Video/Audio)

**GET** `/api/agora/rtc/token`

**Query Parameters:**

- `channelName` (required): Name of the channel
- `uid` (optional): User ID (default: 0)
- `role` (optional): 'publisher' or 'subscriber' (default: 'publisher')

**Example Request:**

```
GET http://localhost:3001/api/agora/rtc/token?channelName=lesson-123&uid=456&role=publisher
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "007abc123...",
    "appId": "your-app-id",
    "channelName": "lesson-123",
    "uid": 456,
    "role": "publisher",
    "expiresIn": 86400,
    "expiresAt": "2026-03-07T12:00:00.000Z"
  }
}
```

### Renew RTC Token

**POST** `/api/agora/rtc/token/renew`

**Request Body:**

```json
{
  "channelName": "lesson-123",
  "uid": 456,
  "role": "publisher"
}
```

**Response:** Same as generate token

### Generate RTM Token (Messaging)

**GET** `/api/agora/rtm/token`

**Query Parameters:**

- `userId` (required): User ID for RTM

**Example Request:**

```
GET http://localhost:3001/api/agora/rtm/token?userId=user-456
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "007xyz789...",
    "appId": "your-app-id",
    "userId": "user-456",
    "expiresIn": 86400,
    "expiresAt": "2026-03-07T12:00:00.000Z"
  }
}
```

## Usage in Frontend

### Basic Usage

```typescript
import { fetchAgoraToken } from "@/lib/agora";

// Fetch token for video call
const token = await fetchAgoraToken("lesson-123", 456, "publisher");

// Use with Agora SDK
await client.join(appId, channelName, token, uid);
```

### With Full Token Data

```typescript
import { fetchAgoraTokenData } from "@/lib/agora";

// Get complete token information
const tokenData = await fetchAgoraTokenData("lesson-123", 456, "publisher");

console.log(`Token expires at: ${tokenData.expiresAt}`);
console.log(`Token valid for: ${tokenData.expiresIn} seconds`);
```

### Token Renewal

```typescript
import { renewAgoraToken } from "@/lib/agora";

// Renew token before expiration (e.g., after 23 hours)
const newToken = await renewAgoraToken("lesson-123", 456, "publisher");

// Update token in Agora client
await client.renewToken(newToken);
```

### RTM Token for Messaging

```typescript
import { fetchAgoraRtmToken } from "@/lib/agora";

// Fetch RTM token
const rtmToken = await fetchAgoraRtmToken("user-456");

// Use with Agora RTM SDK
await rtmClient.login({ userId: "user-456", token: rtmToken });
```

## Testing the Token Server

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

Server should be running on `http://localhost:3001`

### 2. Test Token Generation

**cURL Example:**

```bash
curl "http://localhost:3001/api/agora/rtc/token?channelName=test-channel&uid=123&role=publisher"
```

**Browser Console:**

```javascript
fetch(
  "http://localhost:3001/api/agora/rtc/token?channelName=test-channel&uid=123&role=publisher",
)
  .then((r) => r.json())
  .then(console.log);
```

### 3. Verify Response

You should see a JSON response with:

- `success: true`
- `data.token`: A long string starting with "007"
- `data.expiresIn`: 86400 (24 hours)
- `data.expiresAt`: ISO timestamp

## Token Lifecycle Management

### Automatic Renewal Strategy

Implement automatic token renewal in your video call component:

```typescript
useEffect(() => {
  let renewalTimeout: NodeJS.Timeout;

  // Renew token 5 minutes before expiration (24h - 5m = 23h 55m)
  const renewalTime = (24 * 60 - 5) * 60 * 1000; // 23h 55m in milliseconds

  const scheduleTokenRenewal = async () => {
    renewalTimeout = setTimeout(async () => {
      try {
        const newToken = await renewAgoraToken(channelName, uid, "publisher");
        await client.renewToken(newToken);
        console.log("Token renewed successfully");

        // Schedule next renewal
        scheduleTokenRenewal();
      } catch (error) {
        console.error("Failed to renew token:", error);
      }
    }, renewalTime);
  };

  scheduleTokenRenewal();

  return () => {
    if (renewalTimeout) clearTimeout(renewalTimeout);
  };
}, [channelName, uid]);
```

## Security Considerations

### 1. Add Authentication Middleware (Recommended)

Protect token endpoints with authentication:

```typescript
// In routes/agora.ts
import { authenticateToken } from "../middleware/auth";

router.get("/rtc/token", authenticateToken, generateRtcToken);
```

### 2. Rate Limiting

Consider adding rate limiting to prevent abuse:

```typescript
import rateLimit from "express-rate-limit";

const tokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.get("/rtc/token", tokenLimiter, generateRtcToken);
```

### 3. Channel Name Validation

Validate that users can only access channels they're authorized for:

```typescript
export const generateRtcToken = async (req: Request, res: Response) => {
  const { channelName } = req.query;
  const userId = req.user?.id; // From auth middleware

  // Validate user has access to this channel
  const hasAccess = await checkChannelAccess(userId, channelName);
  if (!hasAccess) {
    return res.status(403).json({ error: "Unauthorized access to channel" });
  }

  // ... continue with token generation
};
```

## Troubleshooting

### Error: "Missing Agora credentials in environment variables"

**Solution:** Add `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` to your backend `.env` file.

### Error: "Failed to fetch Agora token: 500"

**Solution:** Check backend server logs for detailed error messages.

### Token Expires Too Quickly

**Solution:** The current expiration is set to 24 hours. To adjust:

```typescript
// In agoraController.ts
const expirationTimeInSeconds = 86400; // 24 hours
// Change to desired duration (in seconds)
```

### CORS Error When Fetching Token

**Solution:** Ensure your backend CORS configuration includes your frontend URL:

```typescript
// In server.ts
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
```

## Next Steps

1. ✅ **Set up environment variables** - Add Agora credentials to `.env`
2. ✅ **Start backend server** - Run `npm run dev` in backend folder
3. ✅ **Test token generation** - Use cURL or browser to test endpoints
4. 📝 **Implement token renewal** - Add automatic renewal to video call components
5. 🔒 **Add authentication** - Protect endpoints with auth middleware
6. 🚀 **Deploy to production** - Deploy backend with environment variables

## Benefits of This Implementation

✨ **No Manual Updates** - Tokens are generated automatically
🔒 **Improved Security** - Tokens expire regularly and can be renewed
📈 **Scalable** - Handles multiple concurrent requests
🎯 **Production Ready** - Proper error handling and logging
🔧 **Easy to Maintain** - Centralized token logic in backend
🚀 **Better Performance** - Backend generates tokens faster than Next.js API routes

---

**Need Help?**

- Agora Documentation: https://docs.agora.io/
- Token Generator Guide: https://docs.agora.io/en/video-calling/develop/authentication-workflow
