import React, { useState, useEffect, useRef } from "react";
import { SiteConfig, GlobalContentData } from "@trace/config";
import { Avatar, Kbd } from "@trace/ui";
import { ThemePaletteSelector } from "./ThemePaletteSelector";
import {
  RiHome5Line,
  RiArticleLine,
  RiFolderLine,
  RiLinksLine,
  RiUser3Line,
  RiSearch2Line,
  RiMenu4Line
} from "react-icons/ri";

export interface NavbarProps {
  site: SiteConfig;
  data?: GlobalContentData;
  currentPath: string;
  onNavigate?: (path: string) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  site,
  data,
  currentPath,
  onNavigate,
  onOpenSearch,
  onOpenMobileMenu
}) => {
  const NAV_LINKS = [
    { label: "首页", path: "/", icon: RiHome5Line },
    { label: "文章", path: "/articles", icon: RiArticleLine },
    { label: "分类", path: "/categories", icon: RiFolderLine },
    { label: "友链", path: "/friends", icon: RiLinksLine },
    { label: "关于", path: "/me", icon: RiUser3Line }
  ];

  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0
  });

  // 更新磁吸指示器位置
  useEffect(() => {
    if (!navContainerRef.current) return;
    const activeEl = navContainerRef.current.querySelector(`[data-nav-active="true"]`) as HTMLElement | null;
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [currentPath]);

  const handleLinkClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 py-3 md:px-6 md:py-4 pointer-events-none">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between pointer-events-auto">
        {/* 1. 左侧 Logo 与 站点名称 */}
        <div
          onClick={() => handleLinkClick("/")}
          className="flex items-center gap-3 px-3 py-1.5 rounded-full fluid-dock-shell cursor-pointer hover:border-accent/40 transition-all select-none group"
        >
          <Avatar
            src={site.author?.avatar || "/default-avatar.png"}
            name={site.title || "Trace"}
            className="w-7 h-7 ring-1 ring-accent/30 group-hover:scale-105 transition-transform"
          />
          <span className="text-xs font-bold tracking-wide text-foreground group-hover:text-accent transition-colors">
            {site.title || "Trace"}
          </span>
        </div>

        {/* 2. 中间桌面端悬浮导航 Dock */}
        <nav
          ref={navContainerRef}
          className="hidden md:flex items-center relative rounded-full fluid-dock-shell px-1.5 select-none"
        >
          {/* 磁吸平滑指示器 */}
          <div
            className="dock-pill-indicator pointer-events-none"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity
            }}
          />

          {NAV_LINKS.map((link) => {
            const isActive =
              link.path === "/"
                ? currentPath === "/"
                : currentPath === link.path || currentPath.startsWith(`${link.path}/`);
            const Icon = link.icon;

            return (
              <button
                key={link.path}
                type="button"
                data-nav-active={isActive ? "true" : "false"}
                onClick={() => handleLinkClick(link.path)}
                className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "text-accent font-semibold"
                    : "text-foreground/75 hover:text-foreground"
                }`}
              >
                <Icon className="text-sm" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. 右侧操作区：⌘K 搜索 + 莫兰迪色盘/明暗切换 + 移动端汉堡菜单 */}
        <div className="flex items-center gap-1.5 rounded-full fluid-dock-shell px-1.5 select-none">
          {/* ⌘K 搜索按钮 */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs text-foreground/75 hover:text-foreground hover:bg-default/50 transition-all cursor-pointer"
            aria-label="打开全局搜索"
            title="搜索 (Cmd+K)"
          >
            <RiSearch2Line className="text-sm" />
            <span className="hidden lg:inline text-[11px] text-muted">搜索...</span>
            <Kbd keys={["command"]} className="hidden lg:inline-block text-[9px] py-0 px-1">
              K
            </Kbd>
          </button>

          {/* 莫兰迪色盘与明暗切换 */}
          <ThemePaletteSelector />

          {/* 移动端汉堡菜单按钮 */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-foreground/75 hover:text-foreground hover:bg-default/60 transition-all cursor-pointer flex items-center justify-center"
            aria-label="打开移动端菜单"
          >
            <RiMenu4Line className="text-base" />
          </button>
        </div>
      </div>
    </header>
  );
};
