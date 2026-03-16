"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Valores padrão para o tema
const themes = {
  dark: {
    "--bg": "#252530",
    "--fg": "#ede8dc",
    "--accent": "#a07ed4",
    "--muted": "#3c3c4a",
    "--grain-opacity": "0.07",
  },
  light: {
    "--bg": "#ede8dc",
    "--fg": "#252530",
    "--accent": "#6b3fa0",
    "--muted": "#d6d3e0",
    "--grain-opacity": "0.04",
  },
};

type Theme = keyof typeof themes;

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    const vars = themes[theme];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () =>
    setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
