import { NextRequest, NextResponse } from "next/server";
import { decryptValue } from "@/lib/encryption";

// SAFE DEBUG: Print only keys, not secrets


export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    // Read ENV value
    const encrypted = process.env.PROFILE_PASSWORD_ENCRYPTED;

    // Debug this single variable
    console.log("DEBUG PROFILE_PASSWORD_ENCRYPTED =>", encrypted ? "FOUND" : "NOT FOUND");

    if (!encrypted) {
      console.error("PROFILE_PASSWORD_ENCRYPTED env var not set");
      return NextResponse.json(
        { success: false, error: "Password not configured" },
        { status: 500 }
      );
    }

    // Decrypt password
    const expectedPassword = decryptValue(encrypted);

    const isValid = password === expectedPassword;

    return NextResponse.json({ success: isValid });

  } catch (error) {
    console.error("Error verifying profile password:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
