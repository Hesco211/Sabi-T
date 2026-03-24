import { NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/gemini";

type QuizEvaluation = {
  score?: number;
  review?: string;
};

export async function POST(req: Request) {
  try {
    const { skill, language, question, answer } = (await req.json()) as {
      skill?: string;
      language?: string;
      question?: string;
      answer?: string;
    };

    const systemInstruction = "You are Sabi-T, an AI tutor that evaluates beginner quiz answers fairly and constructively.";

    const prompt = `Evaluate this student's answer.

Skill: ${skill || "the selected skill"}
Language: ${language || "English"}
Question: ${question || ""}
Student answer: ${answer || ""}

Respond entirely in ${language || "English"}.
Return strict JSON with this shape:
{
  "score": number,
  "review": string
}

Rules:
- score must be a whole number from 0 to 100.
- review must be constructive, clear, and short.
- return JSON only.`;

    const parsed = await generateGeminiJson<QuizEvaluation>(prompt, systemInstruction);

    return NextResponse.json({
      score: typeof parsed.score === "number" ? parsed.score : 0,
      review: parsed.review || "No feedback provided.",
    });
  } catch (error) {
    console.error("Gemini Quiz Evaluate Error:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
