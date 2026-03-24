// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the 2026 SDK Client
// Ensure GEMINI_API_KEY is in your .env.local
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { message, history, skill, language } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // 1. Define Sabi-T's instructions
    const systemInstruction = `You are Sabi-T, a brilliant Nigerian AI tutor.
    Topic: ${skill || "General Knowledge"}.
    - Use real Nigerian examples (e.g., Danfo, local markets, or metaphors).
    - If vocational (e.g. Tailoring), respond in ${language || "Pidgin"}.
    - If digital (e.g. Coding), respond in English.
    - Be practical, concise, and simplify for beginners.`;

    // 2. Format History natively (2026 Standard)
    // We map your frontend "assistant" role to the required "model" role
    const contents = [
      ...(history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    // 3. Call the latest 2026 model
    // src/app/api/chat/route.ts

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents, // This is your message history + current message
      config: {
        // MOVE IT HERE
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // 4. Return only the text
    return NextResponse.json({ reply: response.text });

  } catch (error: any) {
    console.error("Sabi-T Error:", error);

    // Check for the 404 specifically
    if (error.message?.includes("404")) {
      return NextResponse.json({
        error: "Model not found. Please ensure you are using 'gemini-3-flash-preview'."
      }, { status: 404 });
    }

    return NextResponse.json({
      error: error.message || "Sabi-T is having a small issue. Abeg try again."
    }, { status: 500 });
  }
}