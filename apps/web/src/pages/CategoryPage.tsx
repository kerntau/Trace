import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { ArticleCard } from "../components/ArticleCard";
import { Chip, Button } from "@trace/ui";
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
    <div className="max-w-[1000px] mx-auto px-4 py-10 pt-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">文章分类</h1>
        <p className="text-xs text-default-400">共 {data.categories.length} 个分类目录</p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <Button
          size="sm"
          variant={selectedCate === "" ? "solid" : "flat"}
          color={selectedCate === "" ? "primary" : "default"}
          onClick={() => setSelectedCate("")}
          className="rounded-xl font-semibold text-xs"
        >
          全部 ({data.articles.length})
        </Button>
        {data.categories.map((c) => (
          <Button
            key={c.name}
            size="sm"
            variant={selectedCate === c.name ? "solid" : "flat"}
            color={selectedCate === c.name ? "primary" : "default"}
            startContent={<RiFolderLine />}
            onClick={() => setSelectedCate(c.name)}
            className="rounded-xl font-semibold text-xs"
          >
            {c.name} ({c.count})
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
