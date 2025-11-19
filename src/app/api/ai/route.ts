export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resume } from "@/lib/db/pg/schema.pg";

// === GEMINI IMPORT ===
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/gemini-flash-1.5" });

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    // Get most recent resume
    const rows = await db.select().from(resume).orderBy(resume.id).limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please upload your resume first" },
        { status: 400 }
      );
    }

    const resumeText = rows[0].content;

    const prompt = `
You are an AI assistant answering as **ME** (first person).
Use ONLY details from my resume.
Never say "she", always say "I", "my", "me".

Resume:
${resumeText}

Question:
${question}

Answer as me:
`;

    // === GEMINI REQUEST ===
    const result = await model.generateContent(prompt);
    const answer = result.response.text() || "Sorry, I cannot answer.";

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (err) {
    console.error("Gemini Resume QA Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to answer the question" },
      { status: 500 }
    );
  }
}
