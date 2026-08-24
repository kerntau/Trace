import React, { useState, useEffect, useRef } from "react";
import { SiteConfig, GlobalContentData, Article, FriendLinkItem } from "@trace/config";
import { getInitialTheme, applyTheme, ThemeMode } from "@trace/theme";
import { Avatar, Kbd } from "@trace/ui";
import {
  RiSunLine,
  RiMoonLine,
  RiGithubFill,
  RiCompass3Line,
  RiChatSmile2Line,
  RiFootprintLine,
  RiFlagLine,
  RiPriceTag3Line,
  RiUser3Line,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiArrowLeftLine,
  RiRocketLine,
  RiHome5Line,
  RiBookOpenLine,
  RiFolderLine,
  RiLinksLine,
  RiSearch2Line,
  RiCloseLine,
  RiCornerDownLeftLine,
  RiSparklingFill
} from "react-icons/ri";

export interface HeaderProps {
  site?: SiteConfig;
  data?: GlobalContentData;
  currentPath: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ site: rawSite, data, currentPath, onNavigate }) => {
  const site = data?.site || rawSite || {} as SiteConfig;
  const articles: Article[] = data?.articles || [];
  const friendLinks: FriendLinkItem[] = data?.friendLinks || [];

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isExploreHovered, setIsExploreHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const hoverDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ⌘K 全局搜索面板状态
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 磁吸滑块状态
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0
  });

  useEffect(() => {
    setTheme(getInitialTheme());

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100))));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 全局快捷键监听 (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsHovered(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setSearchSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next as ThemeMode);
  };

  const handleNav = (path: string, e?: React.MouseEvent) => {
    if (path.startsWith("http")) return;
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
    setIsMobileMenuOpen(false);
    setIsExploreHovered(false);
    setIsHovered(false);
    setIsSearchOpen(false);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMouseEnterIsland = () => {
    if (hoverDebounceTimer.current) {
      clearTimeout(hoverDebounceTimer.current);
      hoverDebounceTimer.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeaveIsland = () => {
    if (hoverDebounceTimer.current) clearTimeout(hoverDebounceTimer.current);
    hoverDebounceTimer.current = setTimeout(() => {
      setIsHovered(false);
      setIsExploreHovered(false);
    }, 250);
  };

  const coreNavItems = [
    { title: "首页", path: "/", icon: <RiHome5Line className="text-blue-500 text-xs" /> },
    { title: "文章", path: "/article", icon: <RiBookOpenLine className="text-indigo-500 text-xs" /> },
    { title: "分类", path: "/cate", icon: <RiFolderLine className="text-emerald-500 text-xs" /> },
    { title: "友链", path: "/friend", icon: <RiLinksLine className="text-pink-500 text-xs" /> }
  ];

  const exploreNavItems = [
    { title: "说说微语", path: "/record", icon: <RiChatSmile2Line className="text-amber-500 text-xs" /> },
    { title: "足迹轨迹", path: "/footprint", icon: <RiFootprintLine className="text-emerald-500 text-xs" /> },
    { title: "里程碑", path: "/milestone", icon: <RiFlagLine className="text-blue-500 text-xs" /> },
    { title: "标签索引", path: "/tags", icon: <RiPriceTag3Line className="text-indigo-500 text-xs" /> },
    { title: "关于博主", path: "/my", icon: <RiUser3Line className="text-pink-500 text-xs" /> }
  ];

  const isArticlePage = currentPath.startsWith("/article/") && currentPath !== "/article";
  const isExploreActive = exploreNavItems.some((item) => currentPath.startsWith(item.path));

  // 准确解析当前文章标题
  const currentArticleSlug = isArticlePage ? decodeURIComponent(currentPath.replace("/article/", "")) : "";
  const currentArticle = articles.find(
    (a) => a.slug === currentArticleSlug || a.id === currentArticleSlug
  );
  const displayArticleTitle = currentArticle?.title || currentArticleSlug || "文章详情";

  // 模糊搜索过滤结果
  const filteredSearchResults = searchQuery.trim()
    ? [
        ...articles
          .filter((a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .slice(0, 6)
          .map((a) => ({
            id: a.slug,
            type: "article" as const,
            title: a.title,
            desc: a.description || a.category,
            path: `/article/${a.slug}`
          })),
        ...friendLinks
          .filter((f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.desc.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((f) => ({
            id: String(f.id),
            type: "friend" as const,
            title: f.name,
            desc: f.desc,
            path: f.link
          }))
      ]
    : [
        ...articles.slice(0, 4).map((a) => ({
          id: a.slug,
          type: "article" as const,
          title: a.title,
          desc: `分类：${a.category} · ${a.tags?.slice(0, 2).join(", ") || ""}`,
          path: `/article/${a.slug}`
        }))
      ];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchSelectedIndex((prev) => Math.min(filteredSearchResults.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredSearchResults[searchSelectedIndex];
      if (target) {
        if (target.path.startsWith("http")) {
          window.open(target.path, "_blank");
        } else {
          handleNav(target.path);
        }
      }
    }
  };

  const updateIndicatorToActive = () => {
    if (!navContainerRef.current) return;
    const activeEl = navContainerRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeEl) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        opacity: 1
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    setTimeout(updateIndicatorToActive, 50);
  }, [scrollY, isHovered, currentPath]);

  const handleItemMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!navContainerRef.current) return;
    const containerRect = navContainerRef.current.getBoundingClientRect();
    const elRect = e.currentTarget.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1
    });
  };

  // 动态根据页面生成文案提示
  const getPageBadge = () => {
    if (currentPath === "/" || currentPath === "") return { icon: <RiSparklingFill className="text-amber-500 text-[11px]" />, text: "心中有景 · 花香满径" };
    if (currentPath.startsWith("/article")) return { icon: <RiBookOpenLine className="text-indigo-500 text-[11px]" />, text: `技术博文 · ${articles.length} 篇` };
    if (currentPath.startsWith("/cate")) return { icon: <RiFolderLine className="text-emerald-500 text-[11px]" />, text: "分类导航" };
    if (currentPath.startsWith("/friend")) return { icon: <RiLinksLine className="text-pink-500 text-[11px]" />, text: `技术圈友 · ${friendLinks.length} 位` };
    if (currentPath.startsWith("/record")) return { icon: <RiChatSmile2Line className="text-amber-500 text-[11px]" />, text: "说说微语" };
    if (currentPath.startsWith("/footprint")) return { icon: <RiFootprintLine className="text-emerald-500 text-[11px]" />, text: "足迹轨迹" };
    if (currentPath.startsWith("/milestone")) return { icon: <RiFlagLine className="text-blue-500 text-[11px]" />, text: "开发里程碑" };
    if (currentPath.startsWith("/tags")) return { icon: <RiPriceTag3Line className="text-indigo-500 text-[11px]" />, text: "标签索引" };
    if (currentPath.startsWith("/my")) return { icon: <RiUser3Line className="text-pink-500 text-[11px]" />, text: "关于博主" };
    return { icon: <RiSparklingFill className="text-primary text-[11px]" />, text: "心中有景 · 花香满径" };
  };

  const isScrolled = scrollY >= 80;
  const isFullMenuMode = !isScrolled || isMobileMenuOpen;

  const pageBadge = getPageBadge();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-center pointer-events-none select-none">
        <div
          className={`dynamic-island-shell pointer-events-auto rounded-full px-2.5 flex items-center justify-between transition-all duration-300 ease-out cursor-default ${
            isFullMenuMode
              ? "max-w-[580px] w-full"
              : isArticlePage
                ? "max-w-[440px] w-full"
                : "max-w-[380px] w-full"
          }`}
        >
          {/* ========================================================================= */}
          {/* 模式 A：顶部/悬停完整导航态 (Top / Hover Expanded) */}
          {/* ========================================================================= */}
          {isFullMenuMode ? (
            <div className="w-full flex items-center justify-between gap-1 animate-in fade-in duration-200">
              {/* 左侧身份 */}
              <div
                onClick={(e) => handleNav("/", e)}
                className="flex items-center gap-1.5 cursor-pointer group shrink-0 pl-1 pr-2 py-1 rounded-full hover:opacity-80 transition-opacity"
                title="回到首页"
              >
                <Avatar
                  src={site.author?.avatar || "/avatar.webp"}
                  className="w-5.5 h-5.5 rounded-full ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 transition-transform"
                />
                <span className="font-bold text-xs tracking-tight text-neutral-800 dark:text-neutral-100">
                  {site.title || "kerntau"}
                </span>
              </div>

              {/* 中间磁吸导航 */}
              <nav
                ref={navContainerRef}
                onMouseLeave={updateIndicatorToActive}
                className="relative hidden md:flex items-center gap-0.5"
              >
                {/* 磁吸滑块 */}
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-black/6 dark:bg-white/10 jelly-slider pointer-events-none"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity
                  }}
                />

                {coreNavItems.map((item) => {
                  const isActive = item.path === "/"
                    ? currentPath === "/"
                    : currentPath === item.path || currentPath.startsWith(item.path);

                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      data-active={isActive}
                      onClick={(e) => handleNav(item.path, e)}
                      onMouseEnter={handleItemMouseEnter}
                      className={`relative z-10 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                        isActive
                          ? "text-primary dark:text-primary-foreground font-bold"
                          : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium"
                      }`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.title}</span>
                    </a>
                  );
                })}

                {/* 探索下拉 */}
                <div
                  className="relative"
                  onMouseEnter={(e) => {
                    setIsExploreHovered(true);
                    handleItemMouseEnter(e);
                  }}
                  onMouseLeave={() => setIsExploreHovered(false)}
                >
                  <button
                    type="button"
                    data-active={isExploreActive}
                    onClick={() => setIsExploreHovered(!isExploreHovered)}
                    className={`relative z-10 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${
                      isExploreActive
                        ? "text-primary font-bold"
                        : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium"
                    }`}
                  >
                    <RiCompass3Line className="text-purple-500 text-xs" />
                    <span>探索</span>
                    <RiArrowDownSLine
                      className={`text-xs transition-transform duration-200 ${
                        isExploreHovered ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {/* 探索无框毛玻璃二级浮层 */}
                  {isExploreHovered && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 animate-in fade-in zoom-in-95 duration-150 z-50">
                      <div className="island-dropdown-menu rounded-2xl p-1.5 min-w-[145px] shadow-2xl flex flex-col gap-0.5">
                        {exploreNavItems.map((sub) => {
                          const isSubActive = currentPath.startsWith(sub.path);
                          return (
                            <a
                              key={sub.path}
                              href={sub.path}
                              onClick={(e) => handleNav(sub.path, e)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                                isSubActive
                                  ? "bg-primary text-primary-foreground font-bold shadow-xs shadow-primary/30"
                                  : "hover:bg-black/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200"
                              }`}
                            >
                              <span className="text-xs shrink-0">{sub.icon}</span>
                              <span>{sub.title}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              {/* 右侧工具区 */}
              <div className="flex items-center gap-1 shrink-0 pr-0.5">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  title="全局搜索 (⌘K)"
                  aria-label="Search"
                >
                  <RiSearch2Line className="text-xs" />
                </button>

                {site.author?.github && (
                  <a
                    href={site.author.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title="GitHub"
                    aria-label="GitHub"
                  >
                    <RiGithubFill className="text-sm" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  title={theme === "light" ? "切换深色" : "切换浅色"}
                  aria-label="Toggle Theme"
                >
                  {theme === "light" ? (
                    <RiMoonLine className="text-xs" />
                  ) : (
                    <RiSunLine className="text-xs text-amber-400" />
                  )}
                </button>
              </div>
            </div>
          ) : isScrolled && isArticlePage ? (
            /* ========================================================================= */
            /* 模式 B：向下滚动文章沉浸阅读 HUD 模式 (Apple VisionOS 纯净微晶版) */
            /* ========================================================================= */
            <div className="w-full flex items-center justify-between gap-2.5 animate-in fade-in duration-200 px-1">
              {/* 返回按钮：纯净透明无灰斑，悬停点亮 */}
              <button
                type="button"
                onClick={(e) => handleNav("/article", e)}
                className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-primary active:scale-90 transition-all shrink-0"
                title="返回文章列表"
                aria-label="Back to articles"
              >
                <RiArrowLeftLine className="text-xs" />
              </button>

              {/* 中间文章标题 + 纯净科技进度 (无生硬黑圈) */}
              <div className="flex items-center gap-2 min-w-0 flex-1 justify-center px-1">
                <span className="text-[12px] font-medium text-neutral-800 dark:text-neutral-100 truncate max-w-[200px] sm:max-w-[260px] tracking-tight text-center">
                  {displayArticleTitle}
                </span>
                <span className="text-[11px] font-mono font-bold text-primary shrink-0 tracking-tight">
                  {scrollProgress}%
                </span>
              </div>

              {/* 右侧回顶微火箭与主题切换 */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-primary dark:hover:text-white transition-all active:scale-90"
                  title="回到顶部"
                  aria-label="Scroll to top"
                >
                  <RiRocketLine className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-90"
                  aria-label="Toggle Theme"
                >
                  {theme === "light" ? (
                    <RiMoonLine className="text-xs" />
                  ) : (
                    <RiSunLine className="text-xs text-amber-400" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* 模式 C：常规页面向下滚动收敛微型胶囊态 (无框一体化高奢版) */
            /* ========================================================================= */
            <div className="w-full flex items-center justify-between gap-2.5 animate-in fade-in duration-200 px-1">
              {/* 左侧身份 */}
              <div
                onClick={(e) => handleNav("/", e)}
                className="flex items-center gap-1.5 cursor-pointer group shrink-0 pl-0.5 hover:opacity-85 transition-opacity"
                title="回到首页"
              >
                <Avatar
                  src={site.author?.avatar || "/avatar.webp"}
                  className="w-5 h-5 rounded-full ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 transition-transform"
                />
                <span className="font-bold text-xs text-neutral-800 dark:text-neutral-100">
                  {site.title || "kerntau"}
                </span>
              </div>

              {/* 中间动态文案提示：纯粹一体化悬浮呈现，告别生硬白框/灰药丸 */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-center px-1">
                <span className="shrink-0">{pageBadge.icon}</span>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate max-w-[150px] sm:max-w-[200px] tracking-tight">
                  {pageBadge.text}
                </span>
              </div>

              {/* 右侧工具组 */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-95"
                  title="搜索 (⌘K)"
                  aria-label="Search"
                >
                  <RiSearch2Line className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-primary dark:hover:text-white transition-all active:scale-95"
                  title="回到顶部"
                  aria-label="Scroll to top"
                >
                  <RiRocketLine className="text-xs" />
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-95"
                  aria-label="Toggle Theme"
                >
                  {theme === "light" ? (
                    <RiMoonLine className="text-xs" />
                  ) : (
                    <RiSunLine className="text-xs text-amber-400" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 移动端抽屉菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-4 right-4 island-dropdown-menu rounded-3xl p-3.5 shadow-2xl flex flex-col gap-1 animate-in fade-in slide-in-from-top-3 z-50 pointer-events-auto h-auto">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1">
              全站导航
            </div>
            {[...coreNavItems, ...exploreNavItems].map((item) => {
              const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path));
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNav(item.path, e)}
                  className={`text-xs font-medium py-2 px-3 rounded-xl flex items-center gap-2 transition ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* ⌘K 全局全屏聚焦搜索模态框 */}
      {/* ========================================================================= */}
      {isSearchOpen && (
        <div
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 z-[100] command-palette-backdrop flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="command-palette-modal rounded-3xl w-full max-w-xl shadow-2xl border border-divider/80 overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* 搜索输入栏 */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-divider/60">
              <RiSearch2Line className="text-primary text-lg shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchSelectedIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="搜索技术文章、分类、标签或友链..."
                className="w-full bg-transparent text-sm md:text-base text-foreground placeholder:text-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-default-100 text-neutral-400"
                >
                  <RiCloseLine />
                </button>
              )}
              <Kbd>Esc</Kbd>
            </div>

            {/* 结果列表 */}
            <div className="max-h-[60vh] overflow-y-auto p-3 flex flex-col gap-1.5">
              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map((res, idx) => {
                  const isSelected = idx === searchSelectedIndex;
                  return (
                    <div
                      key={res.id + res.path}
                      onClick={() => {
                        if (res.path.startsWith("http")) {
                          window.open(res.path, "_blank");
                        } else {
                          handleNav(res.path);
                        }
                      }}
                      onMouseEnter={() => setSearchSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                          : "hover:bg-default-100 dark:hover:bg-default-50/15 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`p-2 rounded-xl text-sm shrink-0 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-default-100 dark:bg-default-50/20 text-primary"
                          }`}
                        >
                          {res.type === "article" ? <RiBookOpenLine /> : <RiLinksLine />}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs md:text-sm truncate">
                            {res.title}
                          </span>
                          <span
                            className={`text-[11px] truncate ${
                              isSelected ? "text-white/80" : "text-neutral-400"
                            }`}
                          >
                            {res.desc}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-xs flex items-center gap-1 font-semibold shrink-0 ${
                          isSelected ? "text-white" : "text-neutral-400"
                        }`}
                      >
                        直达 <RiCornerDownLeftLine className="text-xs" />
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-neutral-400 flex flex-col items-center gap-2">
                  <RiSearch2Line className="text-2xl opacity-40" />
                  <span>未找到匹配结果，请尝试其他关键词</span>
                </div>
              )}
            </div>

            {/* 快捷键提示底栏 */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-default-100/50 dark:bg-default-50/10 border-t border-divider/40 text-[11px] text-neutral-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> 切换</span>
                <span className="flex items-center gap-1"><Kbd>↵</Kbd> 回车直达</span>
              </div>
              <span>共 {articles.length} 篇博文可检索</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
