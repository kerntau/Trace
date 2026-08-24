export type ThemeMode = "light" | "dark" | "system";
export type ThemePalette = "sage" | "terracotta" | "slate";

export interface ThemeSettings {
  mode: "light" | "dark";
  palette: ThemePalette;
}

export function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("trace_theme") as ThemeMode | null;
  if (saved === "dark") return "dark";
  if (saved === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getInitialPalette(): ThemePalette {
  if (typeof window === "undefined") return "sage";
  const saved = localStorage.getItem("trace_palette") as ThemePalette | null;
  if (saved === "sage" || saved === "terracotta" || saved === "slate") {
    return saved;
  }
  return "sage";
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

export function applyPalette(palette: ThemePalette) {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-theme-palette", palette);
  localStorage.setItem("trace_palette", palette);
}

export function initThemeSystem() {
  if (typeof window === "undefined") return;
  const theme = getInitialTheme();
  const palette = getInitialPalette();
  applyTheme(theme);
  applyPalette(palette);
}

