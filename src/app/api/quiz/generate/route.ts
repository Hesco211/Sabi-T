import { NextResponse } from "next/server";
import { generateGeminiText } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { skill, language } = (await req.json()) as {
      skill?: string;
      language?: string;
    };

    const systemInstruction = `You are Sabi-T, an AI tutor that writes practical quiz questions for beginners.
Use simple language, Nigerian context where helpful, and return only the question text.`;

    const prompt = `Generate a single practical, beginner-friendly quiz question about the skill "${skill || "the selected skill"}".
The question must be written in ${language || "the selected language"}.
Return only the question text, with no heading, answer, bullet, or explanation.`;

    const question = await generateGeminiText(prompt, systemInstruction);
    return NextResponse.json({ question });
  } catch (error) {
    console.error("Gemini Quiz Generate Error:", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}
