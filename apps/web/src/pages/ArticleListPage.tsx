import React from "react";
import { GlobalContentData, Article } from "@trace/config";
import { formatDate } from "@trace/utils";

export interface ArticleListPageProps {
  data: GlobalContentData;
  onNavigate?: (path: string) => void;
}

export const ArticleListPage: React.FC<ArticleListPageProps> = ({ data, onNavigate }) => {
  const yearMap = new Map<string, Article[]>();
  for (const art of data.articles) {
    const date = new Date(Number(art.createTime) || Date.now());
    const year = String(date.getFullYear());
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(art);
  }

  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-subtle-grid pt-24 pb-20 px-4">
      <div className="max-w-[840px] mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">文章时间线归档</h1>
          <p className="text-xs text-muted">累计沉淀 {data.articles.length} 篇技术博文与思考</p>
        </div>

        <div className="space-y-10">
          {sortedYears.map((year) => (
            <div key={year} className="relative pl-6 md:pl-8 border-l-2 border-accent/20">
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
              <h2 className="text-xl font-bold text-foreground mb-4">{year}</h2>

              <div className="space-y-3">
                {yearMap.get(year)!.map((art) => (
                  <div
                    key={art.slug}
                    onClick={() => onNavigate && onNavigate(`/article/${art.slug}`)}
                    className="gentle-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted font-medium shrink-0">
                        {formatDate(art.createTime, "YYYY/MM/DD")}
                      </span>
                      <h3 className="text-xs md:text-sm font-semibold text-foreground group-hover:text-accent transition truncate text-left">
                        {art.title}
                      </h3>
                    </div>
                    {art.category && (
                      <span className="px-2 py-0.5 rounded-full bg-default/50 text-[11px] text-muted self-start md:self-auto font-medium">
                        {art.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
