import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing GOOGLE_API_KEY" },
        { status: 400 }
      );
    }

    // Manual API call because SDK removed listModels()
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey;

    const response = await fetch(url);
    const json = await response.json();

    if (!json.models) {
      return NextResponse.json(
        { success: false, error: "No models returned", raw: json },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      models: json.models.map((m: any) => ({
        name: m.name,
        description: m.description,
        methods: m.supportedGenerationMethods,
      })),
    });
  } catch (err) {
    console.error("ListModels Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load models" },
      { status: 500 }
    );
  }
}
