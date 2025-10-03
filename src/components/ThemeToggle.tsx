import React, { useEffect, useState } from "react";
import "./ThemeToggle.css";

const THEME_KEY = "theme-preference";

function getPreferredTheme(): "light" | "dark" {
  const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
  if (stored) return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getPreferredTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="theme-toggle__icon" aria-hidden>
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
      <span className="theme-toggle__label">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
};
