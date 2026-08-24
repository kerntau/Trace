import React from "react";
import { Article, Category } from "@trace/config";
import { formatDate } from "@trace/utils";
import {
  RiSparklingFill,
  RiCalendarLine,
  RiTimeLine,
  RiArrowRightLine,
  RiFolderLine
} from "react-icons/ri";

export interface HeroFeaturedProps {
  articles: Article[];
  categories?: Category[];
  onSelect?: (slug: string) => void;
  onNavigate?: (path: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  articles,
  categories = [],
  onSelect,
  onNavigate
}) => {
  const featuredArticles = articles.filter((a) => a.isTop || (a.views && a.views > 100));
  const mainArticle = featuredArticles[0] || articles[0];
  const secondaryArticle = featuredArticles[1] || articles[1];

  if (!mainArticle) return null;

  return (
    <div className="mb-10">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-accent/10 text-accent">
            <RiSparklingFill className="text-xs" />
          </span>
          <h2 className="text-base font-bold text-foreground tracking-tight">
            精选好文与专栏雷达
          </h2>
        </div>
        <span className="text-xs text-muted font-medium">
          Featured & Highlights
        </span>
      </div>

      {/* 温润 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* 1. 主打深度好文大卡 (8 Col) */}
        <div
          className="md:col-span-8 gentle-card rounded-3xl p-6 md:p-8 flex flex-col justify-between cursor-pointer group"
          onClick={() => onSelect && onSelect(mainArticle.slug)}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">
                置顶深度好文
              </span>
              {mainArticle.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-default/60 text-muted text-xs font-medium">
                  {mainArticle.category}
                </span>
              )}
              <span className="text-xs text-muted flex items-center gap-1 ml-auto">
                <RiCalendarLine className="text-xs" /> {formatDate(mainArticle.createTime)}
              </span>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
              {mainArticle.title}
            </h3>

            <p className="text-xs md:text-sm text-muted line-clamp-3 leading-relaxed mb-6">
              {mainArticle.description || "探讨现代前端工程架构、设计系统与全栈实践沉淀..."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/70">
            <div className="flex flex-wrap items-center gap-1.5">
              {mainArticle.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-default/50 text-muted font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              开启阅读 <RiArrowRightLine className="text-sm" />
            </span>
          </div>
        </div>

        {/* 2. 右侧次席卡与分类雷达 (4 Col) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* 次席推荐博文卡 */}
          {secondaryArticle && (
            <div
              className="gentle-card rounded-3xl p-5 cursor-pointer group flex flex-col justify-between flex-1"
              onClick={() => onSelect && onSelect(secondaryArticle.slug)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium">
                    {secondaryArticle.category || "精选推荐"}
                  </span>
                  <span className="text-[11px] text-muted flex items-center gap-1">
                    <RiTimeLine className="text-xs" /> {secondaryArticle.readingTime?.minutes || 3} 分钟
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-2">
                  {secondaryArticle.title}
                </h4>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {secondaryArticle.description || "点击阅读全文以查看详细内容。"}
                </p>
              </div>

              <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted">
                <span>推荐阅读</span>
                <span className="text-accent font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  阅读全文 <RiArrowRightLine className="text-xs" />
                </span>
              </div>
            </div>
          )}

          {/* 分类专栏微卡 */}
          <div
            className="gentle-card rounded-3xl p-5 cursor-pointer group flex flex-col justify-between flex-1"
            onClick={() => onNavigate && onNavigate("/categories")}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
                  <RiFolderLine className="text-sm" /> 专栏雷达
                </span>
                <span className="text-[11px] text-muted">
                  {categories.length} 个技术专栏
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {categories.slice(0, 5).map((c) => (
                  <span
                    key={c.id || c.name}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-default/50 text-foreground/80 font-medium group-hover:bg-accent/15 group-hover:text-accent transition-colors"
                  >
                    {c.name} ({c.count})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted">
              <span>全部分类专栏</span>
              <span className="text-accent font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                浏览专栏 <RiArrowRightLine className="text-xs" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
