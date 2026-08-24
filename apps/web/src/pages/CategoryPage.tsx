import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { ArticleCard } from "../components/ArticleCard";
import { RiFolderLine } from "react-icons/ri";

export interface CategoryPageProps {
  data: GlobalContentData;
  activeCategory?: string;
  onNavigate?: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ data, activeCategory, onNavigate }) => {
  const [selectedCate, setSelectedCate] = useState<string>(activeCategory || "");

  const filteredArticles = selectedCate
    ? data.articles.filter((a) => a.category === selectedCate)
    : data.articles;

  return (
    <div className="min-h-screen bg-subtle-grid pt-24 pb-20 px-4">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">专栏分类目录</h1>
          <p className="text-xs text-muted">共 {data.categories.length} 个技术专栏，{data.articles.length} 篇博文</p>
        </div>

        {/* 分类 Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setSelectedCate("")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCate === ""
                ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                : "bg-default/50 text-foreground/80 hover:bg-default"
            }`}
          >
            全部 ({data.articles.length})
          </button>
          {data.categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedCate(c.name)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCate === c.name
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                : "bg-default/50 text-foreground/80 hover:bg-default"
              }`}
            >
              <RiFolderLine className="text-xs" />
              <span>{c.name} ({c.count})</span>
            </button>
          ))}
        </div>

        {/* 文章网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((art) => (
            <ArticleCard
              key={art.slug}
              article={art}
              onSelect={(slug) => onNavigate && onNavigate(`/article/${slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
