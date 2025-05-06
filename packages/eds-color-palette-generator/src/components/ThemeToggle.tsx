"use client";

import { useColorScheme } from "@/context/ColorSchemeContext";

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <button
      onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      className="fixed p-2 transition-colors bg-gray-100 border-2 border-gray-300 rounded-lg dark:border-gray-700 top-4 right-4 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 "
    >
      {colorScheme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
