import React from "react";
import { Article } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Card, CardBody, Chip } from "@trace/ui";
import {
  RiCalendarLine,
  RiTimeLine,
  RiPushpinFill,
  RiPriceTag3Line,
  RiArrowRightLine,
  RiFileTextLine
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
    <div
      onClick={handleClick}
      className="group relative cursor-pointer select-none rounded-3xl glass-card border border-divider/60 hover:border-primary/40 p-5 md:p-6 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Meta Line */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {article.isTop && (
              <Chip
                size="sm"
                color="warning"
                variant="shadow"
                startContent={<RiPushpinFill className="text-xs ml-1" />}
                className="font-bold text-[11px] shadow-warning/20"
              >
                置顶
              </Chip>
            )}
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="font-semibold text-[11px]"
            >
              {article.category || "默认分类"}
            </Chip>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-default-400 font-medium">
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

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-2.5 leading-snug">
          {article.title}
        </h3>

        {/* Description / Excerpt */}
        <p className="text-xs md:text-sm text-default-500 line-clamp-2 leading-relaxed mb-4">
          {article.description || "点击阅读全文以查看本篇技术博文的详细分析与完整实现。"}
        </p>
      </div>

      {/* Bottom Footer: Tags & Read more */}
      <div className="pt-3 border-t border-divider/40 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden max-h-6">
          {article.tags && article.tags.length > 0 ? (
            article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-md bg-default-100 dark:bg-default-50/20 text-default-600 font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-default-400 flex items-center gap-1">
              <RiFileTextLine /> 文章归档
            </span>
          )}
        </div>

        <div className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
          <span>阅读</span>
          <RiArrowRightLine className="text-sm" />
        </div>
      </div>
    </div>
  );
};
