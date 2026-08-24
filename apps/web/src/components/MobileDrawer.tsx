import React from "react";
import { SiteConfig, GlobalContentData } from "@trace/config";
import { Avatar } from "@trace/ui";
import {
  RiCloseLine,
  RiHome5Line,
  RiArticleLine,
  RiFolderLine,
  RiLinksLine,
  RiUser3Line,
  RiGithubFill,
  RiSearch2Line
} from "react-icons/ri";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  site: SiteConfig;
  data?: GlobalContentData;
  currentPath: string;
  onNavigate?: (path: string) => void;
  onOpenSearch?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  site,
  data,
  currentPath,
  onNavigate,
  onOpenSearch
}) => {
  if (!isOpen) return null;

  const NAV_ITEMS = [
    { label: "首页", path: "/", icon: RiHome5Line },
    { label: "文章", path: "/articles", icon: RiArticleLine, count: data?.articles?.length },
    { label: "分类", path: "/categories", icon: RiFolderLine, count: data?.categories?.length },
    { label: "友链", path: "/friends", icon: RiLinksLine, count: data?.friendLinks?.length },
    { label: "关于", path: "/me", icon: RiUser3Line }
  ];

  const handleNav = (path: string) => {
    onClose();
    if (onNavigate) onNavigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 command-palette-backdrop flex items-end sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl mobile-drawer-sheet p-6 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部个人与关闭按钮 */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar
              src={site.author?.avatar || "/default-avatar.png"}
              name={site.author?.name || site.title}
              className="w-10 h-10 ring-2 ring-accent/20"
            />
            <div>
              <div className="text-sm font-bold text-foreground">
                {site.title || "Trace"}
              </div>
              <div className="text-xs text-muted truncate max-w-[200px]">
                {site.description || "温润自然 · 极简博客"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-default/60 transition-all cursor-pointer"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* 搜索快捷入口 */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-default/40 hover:bg-default/70 text-muted transition-all cursor-pointer text-xs"
          >
            <span className="flex items-center gap-2">
              <RiSearch2Line className="text-sm" />
              <span>搜索文章、分类与标签...</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-default border border-border">
              ⌘K
            </span>
          </button>
        </div>

        {/* 导航链接列表 */}
        <div className="flex flex-col gap-1.5 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-accent/15 text-accent font-bold"
                    : "text-foreground hover:bg-default/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-lg text-muted" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-default/60 text-muted">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 底部社交链接 */}
        {site.author?.github && (
          <div className="pt-4 mt-2 border-t border-border flex items-center justify-center">
            <a
              href={site.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors py-1 px-3 rounded-xl hover:bg-default/50"
            >
              <RiGithubFill className="text-base" />
              <span>GitHub 源码与主页</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
