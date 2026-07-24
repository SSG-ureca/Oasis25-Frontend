import { useState, useEffect, useCallback } from "react";
import {
  getTheme,
  applyTheme,
  toggleTheme as toggleThemeUtil,
} from "../utils/theme";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return getTheme() === "dark";
  });

  useEffect(() => {
    applyTheme(getTheme());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "oasis-theme") return;
      const theme = getTheme();
      applyTheme(theme);
      setIsDark(theme === "dark");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = toggleThemeUtil();
    setIsDark(next === "dark");
    return next;
  }, []);

  return { isDark, toggleTheme };
};
