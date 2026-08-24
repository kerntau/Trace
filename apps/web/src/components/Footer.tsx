import React from "react";
import { SiteConfig } from "@trace/config";

export interface FooterProps {
  site: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ site }) => {
  const currentYear = new Date().getFullYear();
  const sinceYear = site.footer?.sinceYear || 2024;
  const yearText = sinceYear === currentYear ? `${currentYear}` : `${sinceYear} - ${currentYear}`;

  return (
    <footer className="mt-20 border-t border-border/70 py-12 text-xs text-muted select-none">
      <div className="max-w-[1240px] mx-auto px-4 flex flex-col items-center gap-2.5 text-center">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span>{site.title || "Trace"}</span>
          <span className="text-muted/60">·</span>
          <span>{site.description || "心中有景，花香满径"}</span>
        </div>

        <p className="text-muted text-[11px]">
          {site.footer?.copyright || `© ${yearText} ${site.author?.name || "kerntau"}. 保留所有权利。`}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted/80">
          <span>{site.footer?.customText || "基于 Trace 静态驱动架构与温润设计系统构建"}</span>
        </div>
      </div>
    </footer>
  );
};
