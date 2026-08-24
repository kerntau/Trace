import React, { useState, useEffect, useRef } from "react";
import { ThemePalette, ThemeMode, applyTheme, applyPalette, getInitialTheme, getInitialPalette } from "@trace/theme";
import { RiSunLine, RiMoonLine, RiPaletteLine, RiCheckLine } from "react-icons/ri";

const PALETTE_OPTIONS: { id: ThemePalette; name: string; color: string; desc: string }[] = [
  { id: "sage", name: "鼠尾草绿", color: "#5b8a6a", desc: "自然静谧 · 护眼温和" },
  { id: "terracotta", name: "落日陶土", color: "#c86d51", desc: "暖意书卷 · 人文温度" },
  { id: "slate", name: "雾霾灰蓝", color: "#5c7c99", desc: "克制理性 · 雅致纯净" }
];

export const ThemePaletteSelector: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState<ThemePalette>("sage");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(getInitialTheme());
    setPalette(getInitialPalette());

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleMode = () => {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    applyTheme(nextMode);
  };

  const handleSelectPalette = (p: ThemePalette) => {
    setPalette(p);
    applyPalette(p);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center gap-1" ref={dropdownRef}>
      {/* 明暗模式切换按钮 */}
      <button
        type="button"
        onClick={handleToggleMode}
        className="p-2 rounded-xl text-foreground/75 hover:text-foreground hover:bg-default/60 transition-all cursor-pointer flex items-center justify-center"
        aria-label="切换明暗模式"
        title={mode === "dark" ? "切换为明亮模式" : "切换为暗色模式"}
      >
        {mode === "dark" ? (
          <RiSunLine className="text-base text-amber-400 animate-in spin-in-180 duration-300" />
        ) : (
          <RiMoonLine className="text-base text-foreground/80 hover:text-accent duration-300" />
        )}
      </button>

      {/* 莫兰迪色盘切换按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
          isOpen ? "bg-accent/15 text-accent" : "text-foreground/75 hover:text-foreground hover:bg-default/60"
        }`}
        aria-label="切换莫兰迪主题色"
        title="切换莫兰迪主题色"
      >
        <RiPaletteLine className="text-base" />
      </button>

      {/* 下拉面板 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl dock-dropdown-card p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase">
            自然莫兰迪色系
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {PALETTE_OPTIONS.map((item) => {
              const isSelected = palette === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPalette(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-accent/15 text-accent font-medium"
                      : "text-foreground hover:bg-default/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0 border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-medium leading-tight">{item.name}</div>
                      <div className="text-[10px] text-muted leading-tight mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  {isSelected && <RiCheckLine className="text-sm shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
