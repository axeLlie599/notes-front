import { useEffect, useState } from "react";

export type ThemeHook = {
  isDark: boolean;
  toggle: () => void;
  currentTheme: "dark" | "light";
};

export default function useTheme(enabled = true): ThemeHook {
  const [dark, setDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const toggle = () => {
    if (!enabled) return;
    setDark(!dark);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = (e: MediaQueryListEvent) => {
      setDark(e.matches);
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark && enabled);
  }, [enabled, dark]);

  const currentTheme = dark ? "dark" : "light";

  return { isDark: dark, toggle, currentTheme };
}
