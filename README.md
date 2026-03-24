# Sabi-T Tutor

Sabi-T is an AI-powered learning app that helps users learn digital and vocational skills in English and local Nigerian languages.  
It combines guided chat tutoring, quiz generation/evaluation, and progress tracking.

## Features

- Firebase authentication (sign up, login, protected routes)
- Skill and language selection flow
- AI tutor chat experience
- AI-generated quiz questions and answer evaluation
- User progress tracking in Firestore (lessons completed + quiz score)
- Dashboard for learning progress

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Firebase Auth + Firestore
- Google Gemini API (`@google/genai`)
- Tailwind CSS 4

## Project Structure

```txt
src/
  app/
    api/
      chat/route.ts
      quiz/generate/route.ts
      quiz/evaluate/route.ts
    dashboard/page.tsx
    language/page.tsx
    learn/page.tsx
    login/page.tsx
    quiz/page.tsx
    signup/page.tsx
    skills/page.tsx
  components/
  contexts/
  lib/
```

## Prerequisites

- Node.js 20+
- npm 10+
- A Firebase project with:
  - Email/Password auth enabled
  - Firestore database enabled
- A Gemini API key

## Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

GEMINI_API_KEY=your_gemini_api_key
# Optional
GEMINI_MODEL=gemini-2.5-flash
```

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## API Endpoints

- `POST /api/chat`  
  Generates tutor responses based on chat history, selected skill, and delivery language.

- `POST /api/quiz/generate`  
  Generates a beginner-friendly quiz question for the selected skill/language.

- `POST /api/quiz/evaluate`  
  Evaluates a learner answer and returns structured score + feedback.

## Firebase Notes

- Firestore collections used:
  - `users/{userId}/profile/details`
  - `users/{userId}/progress/{skillName}`
- Ensure your Firestore security rules allow authenticated users to read/write their own profile and progress documents.

## Deployment

Deploy on Vercel (recommended) or any Node-compatible platform:

1. Add all environment variables in your hosting dashboard.
2. Run build command: `npm run build`
3. Start command: `npm run start`

## Troubleshooting

- `FirebaseError: client is offline`:
  - Check internet connection and browser network restrictions.
  - Verify Firebase config values in `.env.local`.
  - Ensure Firestore is enabled in your Firebase project.

- Gemini errors:
  - Confirm `GEMINI_API_KEY` is set.
  - Confirm `GEMINI_MODEL` is valid (or omit it to use default).

## License

Define your project license here (e.g. MIT).
