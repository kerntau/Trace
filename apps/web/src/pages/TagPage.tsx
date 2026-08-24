import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { ArticleCard } from "../components/ArticleCard";
import { RiPriceTag3Line } from "react-icons/ri";

export interface TagPageProps {
  data: GlobalContentData;
  activeTag?: string;
  onNavigate?: (path: string) => void;
}

export const TagPage: React.FC<TagPageProps> = ({ data, activeTag, onNavigate }) => {
  const [selectedTag, setSelectedTag] = useState<string>(activeTag || "");

  const filteredArticles = selectedTag
    ? data.articles.filter((a) => a.tags?.includes(selectedTag))
    : data.articles;

  return (
    <div className="min-h-screen bg-subtle-grid pt-24 pb-20 px-4">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">文章标签索引</h1>
          <p className="text-xs text-muted">共 {data.tags.length} 个技术标签</p>
        </div>

        {/* 标签 Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setSelectedTag("")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedTag === ""
                ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                : "bg-default/50 text-foreground/80 hover:bg-default"
            }`}
          >
            全部
          </button>
          {data.tags.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setSelectedTag(t.name)}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedTag === t.name
                  ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                  : "bg-default/50 text-foreground/80 hover:bg-default"
              }`}
            >
              <RiPriceTag3Line className="text-xs" />
              <span>#{t.name} ({t.count})</span>
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
