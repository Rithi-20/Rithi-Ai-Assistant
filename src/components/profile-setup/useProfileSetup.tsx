// src/components/profile-setup/useProfileSetup.tsx
"use client";
import { useCallback, useEffect, useState } from "react";

export function useProfileSetup() {
  const [isSetup, setIsSetup] = useState<boolean>(() => {
    try {
      return localStorage.getItem("profileSetupDone") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onStorage = () => setIsSetup(localStorage.getItem("profileSetupDone") === "true");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const markSetup = useCallback(() => {
    try {
      localStorage.setItem("profileSetupDone", "true");
      setIsSetup(true);
    } catch {}
  }, []);

  return { isSetup, markSetup };
}
