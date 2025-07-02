"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Settings = {
  lighteningMode: boolean;
  highlightPeers: boolean;
  highlightSameNumber: boolean;
};

interface SettingsCtx {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsContext = createContext<SettingsCtx | null>(null);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings>({
    lighteningMode: false,
    highlightPeers: true,
    highlightSameNumber: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("Settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored) as Settings);
      } catch {
        console.warn("Failed to parse stored settings - using defaults.");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === undefined) return;
    localStorage.setItem("Settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
