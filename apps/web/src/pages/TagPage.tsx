import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { ArticleCard } from "../components/ArticleCard";
import { Chip, Button } from "@trace/ui";
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
    <div className="max-w-[1000px] mx-auto px-4 py-10 pt-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">文章标签</h1>
        <p className="text-xs text-default-400">共 {data.tags.length} 个标签索引</p>
      </div>

      {/* Tag Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <Button
          size="sm"
          variant={selectedTag === "" ? "solid" : "flat"}
          color={selectedTag === "" ? "primary" : "default"}
          onClick={() => setSelectedTag("")}
          className="rounded-xl font-semibold text-xs"
        >
          全部
        </Button>
        {data.tags.map((t) => (
          <Button
            key={t.name}
            size="sm"
            variant={selectedTag === t.name ? "solid" : "flat"}
            color={selectedTag === t.name ? "primary" : "default"}
            startContent={<RiPriceTag3Line />}
            onClick={() => setSelectedTag(t.name)}
            className="rounded-xl font-semibold text-xs"
          >
            #{t.name} ({t.count})
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
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
  );
};
