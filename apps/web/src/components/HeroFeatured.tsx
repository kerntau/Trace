import React from "react";
import { Article } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Card, CardBody, Chip, Button } from "@trace/ui";
import {
  RiSparklingFill,
  RiCalendarLine,
  RiTimeLine,
  RiArrowRightLine,
  RiFireLine
} from "react-icons/ri";

export interface HeroFeaturedProps {
  articles: Article[];
  onSelect?: (slug: string) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ articles, onSelect }) => {
  // 找出置顶或推荐最高的 2-3 篇文章
  const featured = articles.filter((a) => a.isTop || (a.views && a.views > 100)).slice(0, 2);
  const mainArticle = featured[0] || articles[0];
  const secondaryArticle = featured[1] || articles[1];

  if (!mainArticle) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <RiSparklingFill className="text-sm animate-pulse" />
        </span>
        <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">
          精选聚光灯 (Featured Spotlight)
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Large Card */}
        <div
          className={`lg:col-span-${secondaryArticle ? "8" : "12"} group cursor-pointer`}
          onClick={() => onSelect && onSelect(mainArticle.slug)}
        >
          <div className="relative overflow-hidden rounded-3xl glass-card border border-primary/20 bg-gradient-to-br from-primary/5 via-content1 to-secondary/5 p-6 md:p-8 h-full flex flex-col justify-between hover:border-primary/40 transition-all">
            {/* Ambient Corner Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Chip
                  size="sm"
                  color="primary"
                  variant="shadow"
                  startContent={<RiFireLine className="text-xs ml-1" />}
                  className="font-semibold shadow-primary/30"
                >
                  主打推荐
                </Chip>
                <Chip size="sm" variant="flat" color="default" className="text-xs">
                  {mainArticle.category}
                </Chip>
                <span className="text-xs text-default-400 flex items-center gap-1 ml-auto">
                  <RiCalendarLine /> {formatDate(mainArticle.createTime)}
                </span>
              </div>

              <h3 className="text-xl md:text-3xl font-black text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                {mainArticle.title}
              </h3>

              <p className="text-sm text-default-600 line-clamp-3 leading-relaxed mb-6">
                {mainArticle.description || "点击阅读全文以探索完整的架构设计与技术实现细节..."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-divider/60">
              <div className="flex flex-wrap items-center gap-1.5">
                {mainArticle.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-default-100 dark:bg-default-50/20 text-default-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                开始阅读 <RiArrowRightLine />
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Featured Card (if available) */}
        {secondaryArticle && (
          <div
            className="lg:col-span-4 group cursor-pointer"
            onClick={() => onSelect && onSelect(secondaryArticle.slug)}
          >
            <div className="relative overflow-hidden rounded-3xl glass-card border border-divider/80 bg-content1/80 p-6 h-full flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Chip size="sm" variant="flat" color="secondary" className="font-semibold text-xs">
                    {secondaryArticle.category}
                  </Chip>
                  <span className="text-xs text-default-400 ml-auto">
                    {formatDate(secondaryArticle.createTime)}
                  </span>
                </div>

                <h4 className="text-base md:text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {secondaryArticle.title}
                </h4>

                <p className="text-xs text-default-500 line-clamp-3 leading-relaxed mb-4">
                  {secondaryArticle.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-divider/40">
                <span className="text-[11px] text-default-400">
                  {secondaryArticle.readingTime?.minutes || 3} 分钟阅读
                </span>
                <span className="text-xs font-semibold text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  探索 <RiArrowRightLine className="text-xs" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
