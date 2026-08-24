import React, { useEffect, useState, useRef } from "react";
import { Article, GlobalContentData } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Button } from "@trace/ui";
import {
  RiCalendarLine,
  RiTimeLine,
  RiArrowGoBackLine,
  RiListCheck2,
  RiCreativeCommonsLine,
  RiArrowRightLine,
  RiBookOpenLine,
  RiFocus3Line,
  RiArrowUpLine
} from "react-icons/ri";

export interface ArticleDetailPageProps {
  slug: string;
  data: GlobalContentData;
  onNavigate?: (path: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  data,
  onNavigate
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [zenTheme, setZenTheme] = useState<"default" | "warm" | "dark-obsidian">("default");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  const article = data.articles.find((a) => a.slug === slug) || {
    id: "not-found",
    slug,
    title: "文章未找到",
    description: "抱歉，您访问的文章不存在或已被移除。",
    content: "<p>抱歉，您访问的文章不存在或已被移除。</p>",
    category: "未分类",
    tags: [],
    createTime: Date.now(),
    toc: []
  } as Article;

  const currentIndex = data.articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? data.articles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < data.articles.length - 1 ? data.articles[currentIndex + 1] : null;

  // 1. 监听滚动进度与 TOC 目录雷达定位
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100))));
      }

      if (article.toc && article.toc.length > 0) {
        const headings = article.toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
        let currentActive = "";
        for (const h of headings) {
          const rect = h.getBoundingClientRect();
          if (rect.top <= 140) {
            currentActive = h.id;
          }
        }
        if (currentActive) {
          setActiveHeadingId(currentActive);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [article.toc]);

  // 2. 快捷键监听 (Z: 禅意模式, Esc: 退出禅意)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key.toLowerCase() === "z" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
      } else if (e.key === "Escape" && isZenMode) {
        setIsZenMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode]);

  // 3. 代码块一键复制
  useEffect(() => {
    if (!contentRef.current) return;
    const preBlocks = contentRef.current.querySelectorAll("pre");
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;
      pre.classList.add("relative", "group");
      
      const copyBtn = document.createElement("button");
      copyBtn.className = "code-copy-btn absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 hover:text-white text-[11px] opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 backdrop-blur-sm cursor-pointer";
      copyBtn.innerHTML = `<span>复制</span>`;
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        const codeText = pre.querySelector("code")?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText);
        copyBtn.innerHTML = `<span style="color:#4ade80;">已复制!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<span>复制</span>`;
        }, 1800);
      };
      pre.appendChild(copyBtn);
    });
  }, [article.content]);

  const fontSizeClass = {
    sm: "text-xs md:text-sm",
    base: "text-sm md:text-base",
    lg: "text-base md:text-lg"
  }[fontSize];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isZenMode
          ? zenTheme === "warm"
            ? "zen-theme-warm pt-12 pb-24"
            : zenTheme === "dark-obsidian"
            ? "zen-theme-dark-obsidian pt-12 pb-24"
            : "pt-12 pb-24"
          : "bg-subtle-grid pt-20 pb-20"
      }`}
    >
      <div
        className={`mx-auto px-4 transition-all duration-300 ${
          isZenMode ? "max-w-[780px]" : "max-w-[1240px]"
        }`}
      >
        {/* 顶部导航与快捷控制条 */}
        <div className="flex items-center justify-between mb-6">
          <Button
            size="sm"
            variant="light"
            onClick={() => onNavigate && onNavigate("/")}
            className="text-xs font-semibold text-muted hover:text-accent rounded-xl"
          >
            <RiArrowGoBackLine className="text-sm mr-1" />
            返回首页
          </Button>

          {/* 禅意模式开关 */}
          <div className="flex items-center gap-2">
            {isZenMode && (
              <div className="flex items-center gap-1 bg-default/40 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setZenTheme("default")}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    zenTheme === "default" ? "bg-accent text-accent-foreground shadow-xs" : "text-muted"
                  }`}
                >
                  默认
                </button>
                <button
                  type="button"
                  onClick={() => setZenTheme("warm")}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    zenTheme === "warm" ? "bg-amber-600 text-white shadow-xs" : "text-muted"
                  }`}
                >
                  暖纸
                </button>
                <button
                  type="button"
                  onClick={() => setZenTheme("dark-obsidian")}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    zenTheme === "dark-obsidian" ? "bg-neutral-900 text-white shadow-xs" : "text-muted"
                  }`}
                >
                  黑曜
                </button>
              </div>
            )}

            <Button
              size="sm"
              variant={isZenMode ? "solid" : "flat"}
              color={isZenMode ? "primary" : "default"}
              onClick={() => setIsZenMode(!isZenMode)}
              className="rounded-xl text-xs font-semibold"
            >
              <RiFocus3Line className="text-sm mr-1" />
              {isZenMode ? "退出禅意 (Z)" : "禅意阅读 (Z)"}
            </Button>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isZenMode ? "grid-cols-1" : "lg:grid-cols-12"} gap-8 items-start`}>
          {/* 主文章区域 */}
          <article className={`${isZenMode ? "w-full" : "lg:col-span-8"} flex flex-col gap-6`}>
            {/* 头部元数据卡片 */}
            <div className="gentle-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {article.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">
                    {article.category}
                  </span>
                )}
                {article.tags?.map((t) => (
                  <span
                    key={t}
                    onClick={() => onNavigate && onNavigate(`/tag/${encodeURIComponent(t)}`)}
                    className="text-xs text-muted hover:text-accent cursor-pointer px-2 py-0.5 rounded-md bg-default/50"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                {article.title}
              </h1>

              {article.description && (
                <p className="text-xs md:text-sm text-muted leading-relaxed mb-6 border-l-2 border-accent pl-3.5 italic">
                  {article.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/70 text-xs text-muted font-medium">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <RiCalendarLine /> {formatDate(article.createTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <RiTimeLine /> {article.readingTime?.minutes || 3} 分钟阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <RiBookOpenLine /> {article.readingTime?.words || 1000} 字
                  </span>
                </div>
              </div>
            </div>

            {/* Markdown 正文内容 */}
            <div
              ref={contentRef}
              className="gentle-card rounded-3xl p-6 md:p-10 prose dark:prose-invert max-w-none text-foreground leading-relaxed"
            >
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className={`article-body-content space-y-5 ${fontSizeClass}`}
              />
            </div>

            {/* 版权声明卡片 */}
            <div className="gentle-card rounded-3xl p-6 text-xs text-muted space-y-2">
              <div className="font-bold text-foreground text-sm flex items-center gap-2">
                <RiCreativeCommonsLine className="text-accent text-base" /> 版权声明与许可
              </div>
              <p>
                本文标题：<strong className="text-foreground">{article.title}</strong>
              </p>
              <p>
                本文链接：<span className="text-accent underline">{`https://trace.dev/article/${article.slug}`}</span>
              </p>
              <p className="text-muted/80">
                本博客所有文章除特别声明外，均采用 <span className="font-semibold text-foreground">CC BY-NC-SA 4.0</span> 国际许可协议。
              </p>
            </div>

            {/* 上一篇 / 下一篇导航 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <div
                  onClick={() => onNavigate && onNavigate(`/article/${prevArticle.slug}`)}
                  className="gentle-card rounded-2xl p-4 cursor-pointer hover:border-accent/40 transition group"
                >
                  <div className="text-[11px] text-muted flex items-center gap-1 mb-1">
                    <RiArrowGoBackLine /> 上一篇
                  </div>
                  <div className="text-xs md:text-sm font-bold text-foreground group-hover:text-accent line-clamp-1 transition-colors">
                    {prevArticle.title}
                  </div>
                </div>
              ) : <div />}

              {nextArticle && (
                <div
                  onClick={() => onNavigate && onNavigate(`/article/${nextArticle.slug}`)}
                  className="gentle-card rounded-2xl p-4 cursor-pointer hover:border-accent/40 transition text-right group ml-auto w-full"
                >
                  <div className="text-[11px] text-muted flex items-center justify-end gap-1 mb-1">
                    下一篇 <RiArrowRightLine />
                  </div>
                  <div className="text-xs md:text-sm font-bold text-foreground group-hover:text-accent line-clamp-1 transition-colors">
                    {nextArticle.title}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* 右侧粘性 TOC 目录树 */}
          {!isZenMode && (
            <aside className="lg:col-span-4 sticky top-20">
              <div className="gentle-card rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/70 font-bold text-sm text-foreground">
                  <RiListCheck2 className="text-accent text-base" /> 目录导航雷达
                </div>

                {article.toc && article.toc.length > 0 ? (
                  <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto pr-1">
                    {article.toc.map((item) => {
                      const isActive = activeHeadingId === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`text-xs py-1.5 px-2.5 rounded-xl transition-all leading-snug flex items-center gap-1.5 ${
                            isActive
                              ? "bg-accent text-accent-foreground font-bold shadow-xs"
                              : "text-muted hover:text-accent hover:bg-accent/10"
                          } ${
                            item.level === 3 ? "pl-5 text-[11px]" : item.level === 4 ? "pl-7 text-[11px]" : ""
                          }`}
                        >
                          <span className="truncate">{item.text}</span>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-muted py-4 text-center">
                    本文暂无子标题目录
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* 底部悬浮阅读控制岛 (HUD) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-full fluid-dock-shell shadow-xl">
        <span className="text-[11px] font-bold text-accent px-1">
          {scrollProgress}%
        </span>
        <div className="h-3 w-px bg-border mx-0.5" />
        
        {/* 字号调节 */}
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setFontSize("sm")}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
              fontSize === "sm" ? "bg-accent text-accent-foreground" : "text-muted hover:bg-default/50"
            }`}
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontSize("base")}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
              fontSize === "base" ? "bg-accent text-accent-foreground" : "text-muted hover:bg-default/50"
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontSize("lg")}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
              fontSize === "lg" ? "bg-accent text-accent-foreground" : "text-muted hover:bg-default/50"
            }`}
          >
            A+
          </button>
        </div>

        <div className="h-3 w-px bg-border mx-0.5" />

        {/* 禅意模式快速开关 */}
        <button
          type="button"
          onClick={() => setIsZenMode(!isZenMode)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
            isZenMode ? "bg-accent text-accent-foreground shadow-xs" : "text-muted hover:bg-default/50"
          }`}
          title="切换禅意专注模式 (Z)"
        >
          <RiFocus3Line />
          <span>{isZenMode ? "专注中" : "禅意"}</span>
        </button>

        {/* 回到顶部 */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-default/50 transition"
          title="回到顶部"
        >
          <RiArrowUpLine />
        </button>
      </div>
    </div>
  );
};
