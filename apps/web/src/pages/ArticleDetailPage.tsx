import React, { useEffect, useState } from "react";
import { Article, GlobalContentData } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Card, CardHeader, CardBody, Chip, Divider, Button } from "@trace/ui";
import {
  RiCalendarLine,
  RiTimeLine,
  RiArrowGoBackLine,
  RiPriceTag3Line,
  RiListCheck2,
  RiShareLine,
  RiCreativeCommonsLine,
  RiArrowRightLine,
  RiBookOpenLine
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

  // 寻找上一篇和下一篇
  const currentIndex = data.articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? data.articles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < data.articles.length - 1 ? data.articles[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-subtle-grid pt-20 pb-20">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Navigation Breadcrumb / Back */}
        <div className="mb-6">
          <Button
            size="sm"
            variant="light"
            onClick={() => onNavigate && onNavigate("/")}
            startContent={<RiArrowGoBackLine className="text-sm" />}
            className="text-xs font-semibold text-default-500 hover:text-primary rounded-xl"
          >
            返回首页
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Container */}
          <article className="lg:col-span-8 flex flex-col gap-6">
            {/* Header Card */}
            <div className="glass-card rounded-3xl p-6 md:p-10 border border-divider/70 relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Chip size="sm" color="primary" variant="flat" className="font-semibold text-xs">
                  {article.category}
                </Chip>
                {article.tags?.map((t) => (
                  <span
                    key={t}
                    onClick={() => onNavigate && onNavigate(`/tag/${encodeURIComponent(t)}`)}
                    className="text-xs text-default-500 hover:text-primary cursor-pointer px-2 py-0.5 rounded-md bg-default-100 dark:bg-default-50/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
                {article.title}
              </h1>

              {article.description && (
                <p className="text-sm md:text-base text-default-500 leading-relaxed mb-6 border-l-3 border-primary pl-3.5 italic">
                  {article.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-divider/60 text-xs text-default-400 font-medium">
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

            {/* Article Content Body */}
            <div className="glass-card rounded-3xl p-6 md:p-10 border border-divider/70 prose dark:prose-invert max-w-none text-foreground leading-relaxed">
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="article-body-content space-y-4 text-sm md:text-base"
              />
            </div>

            {/* Copyright & License Card */}
            <div className="glass-card rounded-3xl p-6 border border-divider/70 bg-default-50/30 text-xs text-default-600 space-y-2">
              <div className="font-bold text-foreground text-sm flex items-center gap-2">
                <RiCreativeCommonsLine className="text-primary text-base" /> 版权声明
              </div>
              <p>
                本文标题：<strong>{article.title}</strong>
              </p>
              <p>
                本文链接：<span className="text-primary underline">{`https://keru.in/article/${article.slug}`}</span>
              </p>
              <p className="text-default-400">
                本博客所有文章除特别声明外，均采用 <span className="font-semibold">CC BY-NC-SA 4.0</span> 国际许可协议。转载请注明出处！
              </p>
            </div>

            {/* Prev / Next Article Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <div
                  onClick={() => onNavigate && onNavigate(`/article/${prevArticle.slug}`)}
                  className="glass-card rounded-2xl p-4 border border-divider/70 cursor-pointer hover:border-primary/40 transition group"
                >
                  <div className="text-[11px] text-default-400 flex items-center gap-1 mb-1">
                    <RiArrowGoBackLine /> 上一篇
                  </div>
                  <div className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary line-clamp-1 transition-colors">
                    {prevArticle.title}
                  </div>
                </div>
              ) : <div />}

              {nextArticle && (
                <div
                  onClick={() => onNavigate && onNavigate(`/article/${nextArticle.slug}`)}
                  className="glass-card rounded-2xl p-4 border border-divider/70 cursor-pointer hover:border-primary/40 transition text-right group ml-auto w-full"
                >
                  <div className="text-[11px] text-default-400 flex items-center justify-end gap-1 mb-1">
                    下一篇 <RiArrowRightLine />
                  </div>
                  <div className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary line-clamp-1 transition-colors">
                    {nextArticle.title}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Right Sticky Table of Contents (TOC) */}
          <aside className="lg:col-span-4 sticky top-24">
            <div className="glass-card rounded-3xl p-6 border border-divider/70">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-divider/60 font-bold text-sm text-foreground">
                <RiListCheck2 className="text-primary text-base" /> 目录导航 (Contents)
              </div>

              {article.toc && article.toc.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
                  {article.toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`text-xs text-default-600 hover:text-primary hover:bg-primary/5 py-1.5 px-2.5 rounded-lg transition leading-snug ${
                        item.level === 3 ? "pl-5" : item.level === 4 ? "pl-7" : ""
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-default-400 py-4 text-center">
                  本文暂无子标题目录
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
