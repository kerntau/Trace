import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { ProfileHero } from "../components/ProfileHero";
import { HeroFeatured } from "../components/HeroFeatured";
import { ArticleCard } from "../components/ArticleCard";
import { Sidebar } from "../components/Sidebar";
import { Button } from "@trace/ui";
import { RiArticleLine } from "react-icons/ri";

export interface HomePageProps {
  data: GlobalContentData;
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate }) => {
  const { site, articles, categories, tags, records } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const scrollToArticles = () => {
    const el = document.getElementById("articles-section");
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
    <div className="min-h-screen bg-subtle-grid pb-16">
      {/* 1. 优雅温润 Profile 首屏名片 */}
      <ProfileHero
        site={site}
        data={data}
        onExploreArticles={scrollToArticles}
        onNavigate={onNavigate}
      />

      {/* 2. 核心主内容区 */}
      <main id="articles-section" className="max-w-[1240px] mx-auto px-4">
        {/* 精选好文与专栏 Bento 空间 */}
        <HeroFeatured
          articles={articles}
          categories={categories}
          onSelect={(slug) => onNavigate && onNavigate(`/article/${slug}`)}
          onNavigate={onNavigate}
        />

        {/* 双栏布局：左侧文章流 + 右侧温润侧边栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左侧文章流 */}
          <section className="lg:col-span-8 flex flex-col gap-5">
            {/* 分类过滤器 */}
            <div className="gentle-card rounded-3xl p-4 md:p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiArticleLine className="text-accent text-base" />
                  <h2 className="text-sm md:text-base font-bold text-foreground">全部技术博文</h2>
                </div>
                <span className="text-xs text-muted font-medium">
                  共 {filteredArticles.length} 篇
                </span>
              </div>

              {/* 分类切换 Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/70">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("全部");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === "全部"
                      ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                      : "bg-default/50 text-foreground/80 hover:bg-default"
                  }`}
                >
                  全部 ({articles.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id || c.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === c.name
                        ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                        : "bg-default/50 text-foreground/80 hover:bg-default"
                    }`}
                  >
                    {c.name} ({c.count})
                  </button>
                ))}
              </div>
            </div>

            {/* 文章列表 */}
            <div className="flex flex-col gap-4">
              {paginatedArticles.map((art) => (
                <ArticleCard
                  key={art.slug}
                  article={art}
                  onSelect={(slug) => onNavigate && onNavigate(`/article/${slug}`)}
                />
              ))}
            </div>

            {/* 分页控制器 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6">
                <Button
                  size="sm"
                  variant="flat"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    scrollToArticles();
                  }}
                  className="rounded-xl px-4 text-xs font-medium"
                >
                  上一页
                </Button>
                <span className="text-xs text-muted px-2 font-medium">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    scrollToArticles();
                  }}
                  className="rounded-xl px-4 text-xs font-medium"
                >
                  下一页
                </Button>
              </div>
            )}
          </section>

          {/* 右侧粘性侧边栏 */}
          <div className="lg:col-span-4 sticky top-20">
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
      </main>
    </div>
  );
};
