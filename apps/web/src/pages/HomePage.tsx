import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { Banner } from "../components/Banner";
import { HeroFeatured } from "../components/HeroFeatured";
import { ArticleCard } from "../components/ArticleCard";
import { Sidebar } from "../components/Sidebar";
import { Button, Chip } from "@trace/ui";
import { RiArticleLine, RiFireLine, RiTimeLine } from "react-icons/ri";

export interface HomePageProps {
  data: GlobalContentData;
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate }) => {
  const { site, theme, articles, categories, tags, records } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const scrollToContent = () => {
    const el = document.getElementById("content-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 根据分类过滤
  const filteredArticles = selectedCategory === "全部"
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const totalPages = Math.ceil(filteredArticles.length / pageSize);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-subtle-grid">
      {/* 1. Immersive Aurora Banner */}
      <Banner theme={theme} onScrollDown={scrollToContent} />

      {/* 2. Main Content Container */}
      <div id="content-section" className="max-w-[1240px] mx-auto px-4 py-8">
        {/* Hero Featured Spotlight */}
        <HeroFeatured
          articles={articles}
          onSelect={(slug) => onNavigate && onNavigate(`/article/${slug}`)}
        />

        {/* Layout Grid: Articles List + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Articles Stream */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Category Filter Pills & Header */}
            <div className="glass-card rounded-3xl p-4 md:p-5 flex flex-col gap-3 border border-divider/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiArticleLine className="text-primary text-lg" />
                  <h2 className="text-base font-bold text-foreground">全部技术博文</h2>
                </div>
                <span className="text-xs text-default-400 font-medium">
                  展示 {filteredArticles.length} 篇
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-divider/40">
                <Button
                  size="sm"
                  variant={selectedCategory === "全部" ? "solid" : "flat"}
                  color={selectedCategory === "全部" ? "primary" : "default"}
                  onClick={() => {
                    setSelectedCategory("全部");
                    setCurrentPage(1);
                  }}
                  className="rounded-xl text-xs font-semibold px-3"
                >
                  全部 ({articles.length})
                </Button>
                {categories.map((c) => (
                  <Button
                    key={c.id}
                    size="sm"
                    variant={selectedCategory === c.name ? "solid" : "flat"}
                    color={selectedCategory === c.name ? "primary" : "default"}
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setCurrentPage(1);
                    }}
                    className="rounded-xl text-xs font-semibold px-3"
                  >
                    {c.name} ({c.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Articles Stream */}
            <div className="flex flex-col gap-4">
              {paginatedArticles.map((art) => (
                <ArticleCard
                  key={art.slug}
                  article={art}
                  onSelect={(slug) => onNavigate && onNavigate(`/article/${slug}`)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  size="sm"
                  variant="flat"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    scrollToContent();
                  }}
                  className="rounded-xl"
                >
                  上一页
                </Button>
                <span className="text-xs text-default-500 px-3 font-semibold">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    scrollToContent();
                  }}
                  className="rounded-xl"
                >
                  下一页
                </Button>
              </div>
            )}
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <Sidebar
              site={site}
              articles={articles}
              categories={categories}
              tags={tags}
              records={records}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
