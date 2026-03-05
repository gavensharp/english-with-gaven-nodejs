# Product Requirements Document (PRD)
# English Tutoring Web App — Agora Integration

---

## 1. Overview & Goals

### Product Summary
A web-based English tutoring platform built with Next.js that connects tutors
and students through real-time video, chat, and AI-powered voice practice.
The platform leverages Agora's free tier services to deliver a rich,
interactive learning experience.

### Primary Goal
Integrate and validate Agora's core free-tier features — Video Call, In-Session
Chat, and Conversational Voice AI — into the English tutoring web app. Each
feature will be integrated and tested individually before moving to the next,
ensuring stable, production-ready modules.

### Integration Philosophy
- Step-by-step integration coordinated between the IDE and Agora onboarding
- Each Agora feature is treated as an independent module
- Every module must pass functional testing before the next begins
- Free tier limits are respected throughout development and testing

### Success Criteria
- Tutor and student can connect via video call with stable audio/video
- Real-time chat works within an active session
- Voice AI engages students in English conversation practice
- All features operate within Agora's free tier limits
- App is deployable and testable in a staging environment

---

## 2. User Roles

| Role    | Description                                              |
|---------|----------------------------------------------------------|
| Tutor   | Hosts sessions, monitors student progress, uses chat     |
| Student | Joins sessions, practices English, interacts with AI     |
| Admin   | Manages users, monitors usage, tracks Agora consumption  |

---

## 3. Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js (App Router), TypeScript    |
| Styling     | Tailwind CSS                        |
| Video/Audio | Agora SD-RTN (Video SDK)            |
| Chat        | Agora Chat SDK                      |
| Voice AI    | Agora Conversational AI             |
| Auth        | NextAuth.js or Clerk                |
| Token Server| Next.js API Routes                  |
| Deployment  | Vercel                              |

---

## 4. Agora Free Tier Limits

| Product                  | Free Tier Allowance              |
|--------------------------|----------------------------------|
| Video/Audio (SD-RTN)     | 10,000 minutes/month             |
| Agora Chat               | 1M messages/month + 100 MAU      |
| Conversational AI        | Trial minutes (confirm in console)|
| Interactive Whiteboard   | 5,000 minutes/month              |

---

## 5. Project Structure

/app ├── /session → Video call room ├── /chat → Chat panel ├── /practice → Voice AI practice mode ├── /api │ ├── /agora-token → Token generation endpoint │ └── /agora-chat → Chat auth endpoint /components ├── VideoCall.tsx ├── ChatPanel.tsx └── VoiceAI.tsx /lib └── agora.ts → Agora config & shared utilities

## 6. Feature Modules

### MODULE 1 — Video Call (Agora SD-RTN)

#### Description
Enable real-time 1-on-1 video and audio sessions between tutor and student.

#### Agora Product
- Agora Video SDK (Web)

#### Functional Requirements
- Tutor creates a session room with a unique channel name
- Student joins via shared session link
- Both parties can toggle camera and microphone
- Session ends when either party leaves
- Display connection status and participant count

#### Technical Requirements
- Integrate `agora-rtc-sdk-ng`
- Generate secure tokens via Next.js API route (`/api/agora-token`)
- Handle join/leave events and stream publishing
- Responsive video layout (local + remote video tiles)

#### UI Components
- Local video tile (bottom-right corner)
- Remote video tile (main view)
- Control bar: Mute, Camera Off, End Call buttons

#### Testing Checklist
- [ ] Tutor can create and join a channel
- [ ] Student can join the same channel
- [ ] Audio and video streams are visible to both parties
- [ ] Mute/unmute and camera toggle work correctly
- [ ] Session ends cleanly for both users
- [ ] Token generation API works in dev and staging
- [ ] Tested on Chrome, Firefox, Safari

---

### MODULE 2 — In-Session Chat (Agora Chat)

#### Description
Real-time text messaging between tutor and student during a live session.
Supports vocabulary sharing, corrections, and lesson notes.

#### Agora Product
- Agora Chat SDK (formerly Easemob)

#### Functional Requirements
- Chat panel visible alongside the video call
- Messages sent and received in real time
- Support for text messages and image/file sharing
- Chat history persists for the session duration
- Tutor can send vocabulary words, corrections, links

#### Technical Requirements
- Integrate `agora-chat` SDK
- Authenticate users via Agora Chat token (`/api/agora-chat`)
- Use 1-on-1 messaging (peer-to-peer chat)
- Handle connection state and message delivery status

#### UI Components
- Slide-in chat panel (right side of video call)
- Message bubbles (tutor vs student differentiated)
- Input field + send button
- File/image attachment button

#### Testing Checklist
- [ ] Tutor and student can exchange messages in real time
- [ ] Messages appear instantly without page refresh
- [ ] Image and file sharing works
- [ ] Chat history is visible for the session
- [ ] Chat token auth works correctly
- [ ] Tested alongside active video call (no performance issues)

---

### MODULE 3 — Voice AI Practice (Agora Conversational AI)

#### Description
An AI-powered English conversation partner that students can practice with
independently. The AI listens, responds in English, and provides a natural
dialogue experience to improve fluency.

#### Agora Product
- Agora Conversational AI Engine

#### Functional Requirements
- Student starts a voice session with the AI agent
- AI listens to student speech and responds in natural English
- Conversation flows turn-by-turn (student speaks → AI responds)
- Session can be ended by the student at any time
- Optional: display transcript of the conversation

#### Technical Requirements
- Integrate Agora Conversational AI SDK/API
- Connect AI agent to a supported LLM (e.g., OpenAI GPT-4)
- Configure AI persona (friendly English tutor tone)
- Handle audio input/output streams
- Confirm free trial limits in Agora Console before testing

#### UI Components
- Voice practice room (separate from tutor session)
- AI avatar or visual indicator (speaking/listening state)
- Start/End session button
- Optional: live transcript panel

#### Testing Checklist
- [ ] Student can initiate a voice session with the AI
- [ ] AI responds accurately in English
- [ ] Turn-taking works correctly (no audio overlap)
- [ ] Session ends cleanly
- [ ] Transcript displays correctly (if enabled)
- [ ] Free trial minutes tracked in Agora Console

---

## 7. Token Server

All Agora products require secure token generation for production use.

### Endpoints

| Endpoint           | Method | Purpose                        |
|--------------------|--------|--------------------------------|
| /api/agora-token   | GET    | Generate RTC token for video   |
| /api/agora-chat    | GET    | Generate Chat token for user   |

### Token Generation (Video)
```typescript
// /app/api/agora-token/route.ts
import { RtcTokenBuilder, RtcRole } from "agora-token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channelName = searchParams.get("channel");
  const uid = searchParams.get("uid") || "0";

  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID!,
    process.env.AGORA_APP_CERTIFICATE!,
    channelName!,
    parseInt(uid),
    RtcRole.PUBLISHER,
    Math.floor(Date.now() / 1000) + 3600
  );

  return Response.json({ token });
}
Environment Variables
env


AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_app_certificate
AGORA_CHAT_ORG_NAME=your_org_name
AGORA_CHAT_APP_NAME=your_app_name
AGORA_CHAT_CLIENT_ID=your_client_id
AGORA_CHAT_CLIENT_SECRET=your_client_secret

8. Integration & Testing Process
Step-by-Step Coordination Plan
PHASE 1 — Setup
  [ ] Create Agora account and project in Agora Console
  [ ] Enable Video, Chat, and Conversational AI products
  [ ] Copy App ID and App Certificate to .env
  [ ] Install required Agora SDKs in Next.js project

PHASE 2 — Module 1: Video Call
  [ ] Build token server API route
  [ ] Integrate Agora Video SDK
  [ ] Build VideoCall.tsx component
  [ ] Test locally (2 browser tabs)
  [ ] Deploy to staging and test with real devices
  ✅ Sign off before moving to Phase 3

PHASE 3 — Module 2: Chat
  [ ] Enable Agora Chat in console
  [ ] Build chat token API route
  [ ] Integrate Agora Chat SDK
  [ ] Build ChatPanel.tsx component
  [ ] Test chat alongside video call
  ✅ Sign off before moving to Phase 4

PHASE 4 — Module 3: Voice AI
  [ ] Enable Conversational AI in Agora Console
  [ ] Connect LLM (OpenAI or compatible)
  [ ] Configure AI agent persona
  [ ] Build VoiceAI.tsx component
  [ ] Test voice sessions independently
  ✅ Sign off — all modules complete

PHASE 5 — Final Integration
  [ ] Combine all modules into unified session UI
  [ ] End-to-end testing (full tutor/student session)
  [ ] Monitor Agora Console for usage/free tier limits
  [ ] Deploy to production

9. UI/UX Requirements
	•	Clean, distraction-free layout suitable for learning
	•	Color palette: Light Green primary, White, Misty Blue, Dark Green
	•	Mobile-responsive (students may join from phones)
	•	Accessible: keyboard navigable, ARIA labels on buttons
	•	Loading states for all connection events
	•	Error messages for failed connections or token issues

10. Out of Scope (v1)
	•	Recording sessions
	•	Payment/billing integration
	•	Multi-party group calls (3+ participants)
	•	Real-time transcription (no free tier)
	•	Mobile native apps (iOS/Android)

11. Risks & Mitigations
Risk
Mitigation
Exceeding free tier limits
Monitor Agora Console dashboard weekly
Conversational AI trial expiry
Confirm limits before Phase 4 begins
Token expiry mid-session
Implement token renewal logic
Browser mic/camera permissions
Add clear permission request UI
LLM API costs (Voice AI)
Set OpenAI usage limits/budget alerts

PRD Version: 1.0 | Project: English Tutoring Web App | Stack: Next.js + Agora

Step by step instruction from agora website

To implement Interactive Live Streaming with chat in a Next.js frontend web app using Agora, here is a step-by-step outline including SDK download, recommended folder/file structure, and chat translation functionality:

SDK Download and Setup:

For web apps, use the Agora Web SDK (Web SDK 4.x) or the React SDK built on top of it.
You can install the Agora SDK via npm:
npm install agora-rtc-sdk-ng
npm install agora-chat-sdk
Refer to Agora's GitHub samples for web projects: https://github.com/AgoraIO/API-Examples-Web
Recommended Folder/File Structure:

pages/ - Next.js pages
components/ - React components such as VideoPlayer, ChatBox
utils/ - Utility functions like token generation, API calls
services/ - Agora service wrappers for RTC and Chat SDK initialization and management
styles/ - CSS or styled components
Basic Implementation Steps:

Initialize Agora RTC client and join a live streaming channel.
Initialize Agora Chat client to join a chat channel.
Render video streams from broadcaster and audience.
Implement chat UI to send and receive messages.
Synchronize chat messages with the live stream.
Chat Translate Function:

Agora Chat SDK does not provide built-in translation.
You can integrate third-party translation APIs (e.g., Google Translate API, Microsoft Translator) to translate chat messages.
On receiving a chat message, send it to the translation API and display the translated text alongside or instead of the original.
References and Examples:

Agora's official docs and sample projects for web and React: https://docs.agora.io/en/video-calling/overview/product-overview
Example Next.js video call app: https://www.agora.io/en/blog/build-a-next-js-video-call-app/