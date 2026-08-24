import React from "react";
import { GlobalContentData, Article } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Card, CardBody, Chip } from "@trace/ui";

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
    <div className="max-w-[900px] mx-auto px-4 py-10 pt-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">文章归档</h1>
        <p className="text-xs text-default-400">累计创作 {data.articles.length} 篇文章</p>
      </div>

      <div className="space-y-12">
        {sortedYears.map((year) => (
          <div key={year} className="relative pl-6 md:pl-8 border-l-2 border-primary/20">
            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
            <h2 className="text-2xl font-black text-foreground mb-6">{year}</h2>

            <div className="space-y-3.5">
              {yearMap.get(year)!.map((art) => (
                <Card
                  key={art.slug}
                  isPressable
                  onPress={() => onNavigate && onNavigate(`/article/${art.slug}`)}
                  className="w-full border border-divider/60 bg-content1/80 hover:border-primary/50 transition rounded-2xl shadow-xs"
                >
                  <CardBody className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-default-400 font-mono">
                        {formatDate(art.createTime, "YYYY/MM/DD")}
                      </span>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition truncate text-left">
                        {art.title}
                      </h3>
                    </div>
                    {art.category && (
                      <Chip size="sm" variant="flat" color="default" className="text-[11px] self-start md:self-auto">
                        {art.category}
                      </Chip>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
