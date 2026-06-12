import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("mdpdf-theme") as ThemeMode | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      localStorage.setItem("mdpdf-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("mdpdf-theme", "light");
    }
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return { mode, setMode, toggle };
}
