

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resume } from "@/lib/db/pg/schema.pg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    // ⭐ Correct Drizzle syntax using desc()
    const rows = await db
      .select()
      .from(resume)
      .orderBy(desc(resume.id))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please upload your resume first" },
        { status: 400 }
      );
    }

    const resumeText = rows[0].content;

    if (!resumeText || resumeText.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Resume extraction failed. Please upload again." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Gemini API key missing" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });

    const prompt = `
You are answering questions **as me** (first person).

Resume:
${resumeText}

Question:
${question}

Answer as me:
`;

    let result;

    try {
      result = await model.generateContent(prompt);
    } catch {
      model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
      });

      result = await model.generateContent(prompt);
    }

    const answer = result.response.text();

    return NextResponse.json({
      success: true,
      answer,
    });

  } catch (err) {
    console.error("Resume QA Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}
