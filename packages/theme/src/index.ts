export type ThemeMode = "light" | "dark" | "system";

export function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("trace_theme") as ThemeMode | null;
  if (saved === "dark") return "dark";
  if (saved === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  const isDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("trace_theme", mode);
}
