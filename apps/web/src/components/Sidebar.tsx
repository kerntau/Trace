import React from "react";
import { SiteConfig, Article, Category, Tag, RecordItem } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Card, CardHeader, CardBody, Avatar, Chip, Button, Divider } from "@trace/ui";
import {
  RiArticleLine,
  RiFolderLine,
  RiPriceTag3Line,
  RiChatSmile2Line,
  RiGithubFill,
  RiMailFill,
  RiBilibiliFill,
  RiTwitterXFill,
  RiCompass3Line,
  RiSparklingFill,
  RiFlashlightLine,
  RiCodeSSlashLine,
  RiBarChartLine,
  RiLinksLine
} from "react-icons/ri";

export interface SidebarProps {
  site: SiteConfig;
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  records?: RecordItem[];
  onNavigate?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  site,
  articles,
  categories,
  tags,
  records,
  onNavigate
}) => {
  const author = site.author;

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const techStack = [
    { name: "React 19", color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
    { name: "TypeScript", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { name: "Rsbuild", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    { name: "Tailwind v4", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
    { name: "Rust", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    { name: "Go", color: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
    { name: "eBPF", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { name: "ClickHouse", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" }
  ];

  return (
    <aside className="flex flex-col gap-6 select-none">
      {/* 1. 博主全能名片 */}
      <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden border border-divider/70">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20" />
        
        <div className="relative pt-6 flex flex-col items-center">
          <div className="relative mb-3">
            <Avatar
              src={author?.avatar || "/avatar.webp"}
              className="w-20 h-20 rounded-2xl ring-4 ring-background shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-background text-[10px] text-white" title="在线">
              <RiSparklingFill />
            </span>
          </div>

          <h3 className="text-xl font-black text-foreground mb-1">
            {author?.name || site.title || "kerntau"}
          </h3>
          <p className="text-xs text-default-500 mb-4 px-2 leading-relaxed">
            {author?.description || site.subtitle || "心中有景,花香满径"}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 mb-5">
            {author?.github && (
              <a
                href={author.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-default-100 hover:bg-primary/10 hover:text-primary transition-all text-default-600"
                aria-label="GitHub"
              >
                <RiGithubFill className="text-base" />
              </a>
            )}
            {author?.socials?.find((s) => s.name === "Bilibili") && (
              <a
                href={author.socials.find((s) => s.name === "Bilibili")?.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-default-100 hover:bg-pink-500/10 hover:text-pink-500 transition-all text-default-600"
                aria-label="Bilibili"
              >
                <RiBilibiliFill className="text-base" />
              </a>
            )}
            {author?.socials?.find((s) => s.name === "X (Twitter)") && (
              <a
                href={author.socials.find((s) => s.name === "X (Twitter)")?.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-default-100 hover:bg-sky-500/10 hover:text-sky-500 transition-all text-default-600"
                aria-label="X"
              >
                <RiTwitterXFill className="text-base" />
              </a>
            )}
            {author?.email && (
              <a
                href={`mailto:${author.email}`}
                className="p-2 rounded-xl bg-default-100 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all text-default-600"
                aria-label="Email"
              >
                <RiMailFill className="text-base" />
              </a>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-divider/60">
            <div className="flex flex-col items-center">
              <span className="text-base font-black text-foreground">{articles.length}</span>
              <span className="text-[11px] text-default-400">博文</span>
            </div>
            <div className="flex flex-col items-center border-x border-divider/60">
              <span className="text-base font-black text-foreground">{categories.length}</span>
              <span className="text-[11px] text-default-400">分类</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base font-black text-foreground">{tags.length}</span>
              <span className="text-[11px] text-default-400">标签</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 技术栈发光矩阵 */}
      <div className="glass-card rounded-3xl p-5 border border-divider/70">
        <div className="flex items-center gap-2 mb-3.5">
          <RiCodeSSlashLine className="text-primary text-base" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-default-400">技术雷达</h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border ${tech.color} transition-transform hover:scale-105`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* 3. 热门分类 */}
      <div className="glass-card rounded-3xl p-5 border border-divider/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RiFolderLine className="text-primary text-base" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-default-400">文章分类</h4>
          </div>
          <span
            onClick={() => handleNav("/cate")}
            className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
          >
            全部
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {categories.slice(0, 6).map((c) => (
            <div
              key={c.id}
              onClick={() => handleNav(`/cate/${encodeURIComponent(c.name)}`)}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer group"
            >
              <span className="text-xs font-medium text-default-700 group-hover:text-primary">
                {c.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-default-100 dark:bg-default-50/20 text-default-500">
                {c.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 标签云 */}
      <div className="glass-card rounded-3xl p-5 border border-divider/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RiPriceTag3Line className="text-primary text-base" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-default-400">标签云</h4>
          </div>
          <span
            onClick={() => handleNav("/tags")}
            className="text-[11px] text-primary hover:underline cursor-pointer font-medium"
          >
            更多
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 16).map((t) => (
            <span
              key={t.name}
              onClick={() => handleNav(`/tag/${encodeURIComponent(t.name)}`)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-default-100/80 dark:bg-default-50/20 hover:bg-primary hover:text-white text-default-600 font-medium transition-all cursor-pointer"
            >
              #{t.name}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
