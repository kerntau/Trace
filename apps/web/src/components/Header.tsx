import React, { useState, useEffect } from "react";
import { SiteConfig, GlobalContentData } from "@trace/config";
import { initThemeSystem } from "@trace/theme";
import { Navbar } from "./Navbar";
import { SearchCommandModal } from "./SearchCommandModal";
import { MobileDrawer } from "./MobileDrawer";

export interface HeaderProps {
  site?: SiteConfig;
  data?: GlobalContentData;
  currentPath: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  site: rawSite,
  data,
  currentPath,
  onNavigate
}) => {
  const site = data?.site || rawSite || ({} as SiteConfig);
  const articles = data?.articles || [];

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 初始化主题系统（明暗 + 莫兰迪色系）
  useEffect(() => {
    initThemeSystem();

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100))));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 全局快捷键监听 (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* 顶部滚动进度条 */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 核心主导航栏 */}
      <Navbar
        site={site}
        data={data}
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
      />

      {/* ⌘K 全局搜索面板 */}
      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onNavigate={onNavigate}
      />

      {/* 移动端抽屉菜单 */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        site={site}
        data={data}
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </>
  );
};
