import { createContext, useContext, useState } from "react";

export const darkTheme = {
  bg: "#0B0F1A",
  surface: "#131929",
  surfaceHover: "#1a2235",
  border: "#1e2d45",
  text: "#E8F0FF",
  textMuted: "#607090",
  textDim: "#3a4a65",
  accent: "#6366f1",
  accentSoft: "rgba(99,102,241,0.12)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

export const lightTheme = {
  bg: "#F0F4FF",
  surface: "#FFFFFF",
  surfaceHover: "#F5F7FF",
  border: "#D4D9EF",
  text: "#1A1F36",
  textMuted: "#6B7280",
  textDim: "#9CA3AF",
  accent: "#6366f1",
  accentSoft: "rgba(99,102,241,0.08)",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme phải dùng trong ThemeProvider");
  return ctx;
}
