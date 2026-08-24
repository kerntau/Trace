import React, { useState, useEffect, useRef } from "react";
import { Article } from "@trace/config";
import { Kbd } from "@trace/ui";
import {
  RiSearch2Line,
  RiCloseLine,
  RiArticleLine,
  RiFolderLine,
  RiUser3Line,
  RiLinksLine,
  RiHome5Line,
  RiCornerDownLeftLine
} from "react-icons/ri";

export interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onNavigate?: (path: string) => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  isOpen,
  onClose,
  articles,
  onNavigate
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 快速导航动作
  const QUICK_LINKS = [
    { title: "首页", path: "/", icon: RiHome5Line, category: "快速跳转" },
    { title: "博文归档", path: "/articles", icon: RiArticleLine, category: "快速跳转" },
    { title: "分类目录", path: "/categories", icon: RiFolderLine, category: "快速跳转" },
    { title: "友链空间", path: "/friends", icon: RiLinksLine, category: "快速跳转" },
    { title: "关于作者", path: "/me", icon: RiUser3Line, category: "快速跳转" }
  ];

  // 过滤文章
  const filteredArticles = query.trim()
    ? articles.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  const totalResults = query.trim() ? filteredArticles.length : QUICK_LINKS.length;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (totalResults > 0 ? (prev + 1) % totalResults : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (totalResults > 0 ? (prev - 1 + totalResults) % totalResults : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim() && filteredArticles[selectedIndex]) {
        const target = filteredArticles[selectedIndex];
        onClose();
        if (onNavigate) onNavigate(`/article/${target.slug}`);
      } else if (!query.trim() && QUICK_LINKS[selectedIndex]) {
        const target = QUICK_LINKS[selectedIndex];
        onClose();
        if (onNavigate) onNavigate(target.path);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-28 px-4 command-palette-backdrop animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-xl rounded-3xl command-palette-modal overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 输入框顶部区域 */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <RiSearch2Line className="text-lg text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章标题、内容、分类或标签..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted/70"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <RiCloseLine className="text-base" />
            </button>
          ) : (
            <Kbd keys={["escape"]} className="text-[10px] hidden sm:inline-block">ESC</Kbd>
          )}
        </div>

        {/* 结果展示区 */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() ? (
            filteredArticles.length > 0 ? (
              <div className="flex flex-col gap-1">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-muted tracking-wider uppercase">
                  匹配博文 ({filteredArticles.length})
                </div>
                {filteredArticles.map((article, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={article.id || article.slug}
                      onClick={() => {
                        onClose();
                        if (onNavigate) onNavigate(`/article/${article.slug}`);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-accent/15 text-accent"
                          : "text-foreground hover:bg-default/40"
                      }`}
                    >
                      <RiArticleLine className="text-base mt-0.5 shrink-0 text-muted" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate leading-tight">
                          {article.title}
                        </div>
                        {article.description && (
                          <div className="text-[11px] text-muted truncate mt-0.5 leading-tight">
                            {article.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          {article.category && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-default/60 text-muted">
                              {article.category}
                            </span>
                          )}
                          {article.tags?.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] text-muted/80">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isSelected && (
                        <RiCornerDownLeftLine className="text-xs text-accent mt-0.5 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted">
                未找到与 “<span className="text-foreground font-medium">{query}</span>” 相关的文章
              </div>
            )
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-muted tracking-wider uppercase">
                快速导航
              </div>
              {QUICK_LINKS.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <div
                    key={item.path}
                    onClick={() => {
                      onClose();
                      if (onNavigate) onNavigate(item.path);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-accent/15 text-accent font-medium"
                        : "text-foreground hover:bg-default/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-base text-muted shrink-0" />
                      <span className="text-xs">{item.title}</span>
                    </div>
                    {isSelected && (
                      <RiCornerDownLeftLine className="text-xs text-accent shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部按键提示 */}
        <div className="px-4 py-2 bg-default/30 border-t border-border flex items-center justify-between text-[11px] text-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Kbd className="text-[10px]">↑</Kbd>
              <Kbd className="text-[10px]">↓</Kbd>
              <span>选择</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Kbd className="text-[10px]">↵</Kbd>
              <span>进入</span>
            </span>
          </div>
          <span>Trace 智能全局搜索</span>
        </div>
      </div>
    </div>
  );
};
