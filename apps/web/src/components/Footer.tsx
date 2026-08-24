import React from "react";
import { SiteConfig } from "@trace/config";
import { RiHeartFill, RiSparklingFill } from "react-icons/ri";

export interface FooterProps {
  site: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ site }) => {
  const currentYear = new Date().getFullYear();
  const sinceYear = site.footer?.sinceYear || 2024;
  const yearText = sinceYear === currentYear ? `${currentYear}` : `${sinceYear} - ${currentYear}`;

  return (
    <footer className="mt-24 border-t border-divider/60 glass-panel py-10 text-xs text-default-500 select-none">
      <div className="max-w-[1240px] mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-1 font-semibold text-foreground">
          <span>{site.title || "kerntau"}</span>
          <span className="text-default-400">·</span>
          <span>{site.subtitle || "心中有景,花香满径"}</span>
        </div>

        <p className="text-default-400 flex items-center gap-1">
          {site.footer?.copyright || `© ${yearText} ${site.author?.name || "kerntau"}. All Rights Reserved.`}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-default-400">
          <span>{site.footer?.customText || "Powered by Trace Static Engine"}</span>
          <a
            href="https://icp.gov.moe/?keyword=20268811"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors underline"
          >
            萌ICP备20268811号
          </a>
        </div>
      </div>
    </footer>
  );
};
