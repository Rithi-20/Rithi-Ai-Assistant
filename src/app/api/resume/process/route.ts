
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resume } from "@/lib/db/pg/schema.pg";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ❗ extractRawText DOES NOT support styleMap
    const { value: extractedText } = await mammoth.extractRawText({ buffer });

    if (!extractedText || !extractedText.trim() || extractedText.length < 10) {
      return NextResponse.json(
        { success: false, error: "Could not extract text from resume" },
        { status: 400 }
      );
    }

    console.log("EXTRACTED TEXT:", extractedText.substring(0, 300));

    // Delete previous resume
    await db.delete(resume);

    // Insert new resume
    await db.insert(resume).values({
      content: extractedText,
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      text: extractedText,
    });

  } catch (error) {
    console.error("Resume Extract Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
