import React from "react";
import { SiteConfig, Article, Category, Tag, RecordItem } from "@trace/config";
import { Avatar } from "@trace/ui";
import {
  RiArticleLine,
  RiFolderLine,
  RiPriceTag3Line,
  RiGithubFill,
  RiMailFill,
  RiCodeSSlashLine
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
    "React 19", "TypeScript", "Rsbuild", "Tailwind v4", "HeroUI", "Rust", "Go", "ClickHouse"
  ];

  return (
    <aside className="flex flex-col gap-5 select-none">
      {/* 1. 作者温润卡片 */}
      <div className="gentle-card rounded-3xl p-5 text-center flex flex-col items-center">
        <Avatar
          src={author?.avatar || "/default-avatar.png"}
          name={author?.name || site.title}
          className="w-16 h-16 rounded-full mb-2.5 ring-2 ring-accent/30"
        />

        <h3 className="text-base font-bold text-foreground mb-1">
          {author?.name || site.title || "kerntau"}
        </h3>
        <p className="text-xs text-muted mb-3 px-2 leading-relaxed">
          {author?.description || site.description || "心中有景，花香满径"}
        </p>

        {/* 社交链接 */}
        <div className="flex items-center gap-1.5 mb-4">
          {author?.github && (
            <a
              href={author.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-default/50 hover:bg-accent/15 hover:text-accent transition-colors text-muted"
              title="GitHub"
            >
              <RiGithubFill className="text-base" />
            </a>
          )}
          {author?.email && (
            <a
              href={`mailto:${author.email}`}
              className="p-2 rounded-xl bg-default/50 hover:bg-accent/15 hover:text-accent transition-colors text-muted"
              title="Email"
            >
              <RiMailFill className="text-base" />
            </a>
          )}
        </div>

        {/* 统计指标 */}
        <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-border/70">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-foreground">{articles.length}</span>
            <span className="text-[11px] text-muted">博文</span>
          </div>
          <div className="flex flex-col items-center border-x border-border/70">
            <span className="text-sm font-bold text-foreground">{categories.length}</span>
            <span className="text-[11px] text-muted">分类</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-foreground">{tags.length}</span>
            <span className="text-[11px] text-muted">标签</span>
          </div>
        </div>
      </div>

      {/* 2. 技术栈雷达 */}
      <div className="gentle-card rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <RiCodeSSlashLine className="text-accent text-base" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted">技术栈矩阵</h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-default/50 text-foreground/80 hover:bg-accent/15 hover:text-accent transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 3. 热门分类专栏 */}
      <div className="gentle-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RiFolderLine className="text-accent text-base" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">文章分类</h4>
          </div>
          <button
            type="button"
            onClick={() => handleNav("/categories")}
            className="text-[11px] text-accent hover:underline cursor-pointer font-medium"
          >
            全部
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {categories.slice(0, 6).map((c) => (
            <div
              key={c.id || c.name}
              onClick={() => handleNav(`/category/${encodeURIComponent(c.name)}`)}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer group text-xs"
            >
              <span className="text-foreground/80 group-hover:text-accent font-medium">
                {c.name}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-default/60 text-muted">
                {c.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 标签云 */}
      <div className="gentle-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RiPriceTag3Line className="text-accent text-base" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">标签云</h4>
          </div>
          <button
            type="button"
            onClick={() => handleNav("/categories")}
            className="text-[11px] text-accent hover:underline cursor-pointer font-medium"
          >
            全部
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 15).map((t) => (
            <span
              key={t.name}
              onClick={() => handleNav(`/tag/${encodeURIComponent(t.name)}`)}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-default/50 hover:bg-accent/15 hover:text-accent text-muted font-medium transition-colors cursor-pointer"
            >
              #{t.name}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
