import React from "react";
import { Article } from "@trace/config";
import { formatDate } from "@trace/utils";
import {
  RiCalendarLine,
  RiTimeLine,
  RiPushpinFill,
  RiArrowRightLine
} from "react-icons/ri";

export interface ArticleCardProps {
  article: Article;
  onSelect?: (slug: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(article.slug);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="gentle-card rounded-3xl p-5 md:p-6 cursor-pointer select-none group flex flex-col justify-between"
    >
      <div>
        {/* 顶部元数据行 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {article.isTop && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-semibold">
                <RiPushpinFill className="text-[10px]" />
                <span>置顶</span>
              </span>
            )}
            {article.category && (
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium">
                {article.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-muted font-medium">
            <span className="flex items-center gap-1">
              <RiCalendarLine className="text-xs" />
              {formatDate(article.createTime)}
            </span>
            <span className="flex items-center gap-1">
              <RiTimeLine className="text-xs" />
              {article.readingTime?.minutes || 3} 分钟
            </span>
          </div>
        </div>

        {/* 标题 */}
        <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-200 mb-2 leading-snug">
          {article.title}
        </h3>

        {/* 摘要 */}
        <p className="text-xs md:text-sm text-muted line-clamp-2 leading-relaxed mb-4">
          {article.description || "点击阅读全文以查看本篇博文的详细分析与完整实现。"}
        </p>
      </div>

      {/* 底部：标签云与阅读按钮 */}
      <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden max-h-6">
          {article.tags && article.tags.length > 0 ? (
            article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-lg bg-default/50 text-muted font-medium group-hover:text-accent group-hover:bg-accent/10 transition-colors"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-muted">技术博文</span>
          )}
        </div>

        <div className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
          <span>阅读全文</span>
          <RiArrowRightLine className="text-sm" />
        </div>
      </div>
    </article>
  );
};
