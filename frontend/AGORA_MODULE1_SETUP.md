# Agora Integration - Module 1: Video Call

## ✅ Completed Setup

### 1. Installed Packages

- ✅ `agora-rtc-sdk-ng` - Agora Video SDK for web
- ✅ `agora-token` - Token generation for secure authentication

### 2. Created Files

#### Components

- **`src/components/agora/VideoCall.tsx`**
  - Full-featured video call component
  - Local and remote video display
  - Audio/video toggle controls
  - Join/leave channel functionality

#### Configuration

- **`src/lib/agora.ts`**
  - Agora configuration utilities
  - Token fetching helper function
  - Config validation

#### API Routes

- **`src/app/api/agora/token/route.ts`**
  - Secure token generation endpoint
  - Handles RTC token creation for video calls

#### Test Page

- **`src/app/session/page.tsx`**
  - Test page for video call
  - Access at: `http://localhost:3000/session`

#### Environment Files

- **`.env.local`** - Your private environment variables (DO NOT COMMIT)
- **`.env.example`** - Template for required variables

---

## 🔑 Next Steps: Get Your Agora Credentials

### 1. Get App ID and App Certificate from Agora Console

Go to your Agora Console and copy these values:

1. **App ID** (public)
2. **App Certificate** (secret - for token generation)

### 2. Add Values to `.env.local`

Open `/frontend/.env.local` and fill in:

```env
# Frontend (Public)
NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here

# Backend (Server-side only)
AGORA_APP_CERTIFICATE=your_app_certificate_here
```

⚠️ **Important:**

- `NEXT_PUBLIC_AGORA_APP_ID` - Exposed to browser (safe)
- `AGORA_APP_CERTIFICATE` - Kept secret on server (never exposed to browser)

---

## 🧪 Testing the Video Call

### Step 1: Start the Development Server

```bash
cd frontend
npm run dev
```

### Step 2: Open Test Page

Navigate to: **http://localhost:3000/session**

### Step 3: Test with Two Browsers

1. Open the session page in **Chrome**
2. Open the session page in **Firefox** (or another Chrome tab in incognito)
3. Click "Join Video Call" on both
4. You should see each other's video!

### Step 4: Test Controls

- 🎤 Toggle microphone
- 📹 Toggle camera
- End call button

---

## 📁 Folder Structure

```
frontend/src/
├── components/agora/
│   └── VideoCall.tsx          # Video call UI component
├── lib/
│   └── agora.ts               # Config & utilities
├── app/
│   ├── session/
│   │   └── page.tsx           # Test page
│   └── api/agora/
│       └── token/
│           └── route.ts       # Token generation API
└── .env.local                 # Environment variables
```

---

## 🎯 Module 1 Checklist

- [x] Install `agora-rtc-sdk-ng`
- [x] Install `agora-token`
- [x] Create folder structure
- [x] Build VideoCall component
- [x] Build token server API route
- [x] Create test page
- [ ] **Get App ID from Agora Console** ← YOU ARE HERE
- [ ] **Get App Certificate from Agora Console**
- [ ] **Add credentials to .env.local**
- [ ] Test locally (2 browser tabs)
- [ ] Deploy to staging
- [ ] ✅ Sign off Module 1

---

## 🐛 Troubleshooting

### "Missing Agora credentials" Error

- Make sure NEXT_PUBLIC_AGORA_APP_ID and AGORA_APP_CERTIFICATE are set in `.env.local`
- Restart the dev server after adding environment variables

### "Failed to join channel" Error

- Check browser console for detailed error
- Verify App ID is correct
- Verify token generation is working (check Network tab)

### No Video/Audio

- Allow browser permissions for camera and microphone
- Check if camera/mic are being used by another app

### Remote User Not Showing

- Make sure both users join the same channel name
- Check Agora Console for active channels

---

## 📚 References

- [Agora Web SDK Documentation](https://docs.agora.io/en/video-calling/overview/product-overview)
- [Agora Token Generation](https://docs.agora.io/en/video-calling/develop/authentication-workflow)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Ready for Module 2?** Once video calling is working, we'll add in-session chat!
