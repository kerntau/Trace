import React from "react";
import { SiteConfig, GlobalContentData } from "@trace/config";
import { Avatar, Button } from "@trace/ui";
import {
  RiArticleLine,
  RiFolderLine,
  RiSparklingFill,
  RiCompass3Line,
  RiGithubFill,
  RiHeartPulseLine
} from "react-icons/ri";

export interface ProfileHeroProps {
  site: SiteConfig;
  data: GlobalContentData;
  onExploreArticles?: () => void;
  onNavigate?: (path: string) => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  site,
  data,
  onExploreArticles,
  onNavigate
}) => {
  const { articles = [], categories = [] } = data;

  const calculateDays = (sinceYear?: number) => {
    if (!sinceYear) return 100;
    const start = new Date(`${sinceYear}-01-01`).getTime();
    const now = new Date().getTime();
    return Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  };

  const daysRunning = calculateDays(site.footer?.sinceYear || 2024);

  return (
    <section className="relative w-full pt-24 pb-8 md:pt-28 md:pb-12 select-none">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* 温润主卡片 */}
        <div className="gentle-card rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative overflow-hidden">
          {/* 左侧头像与状态环 */}
          <div className="relative shrink-0">
            <div className="relative p-1 rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent">
              <Avatar
                src={site.author?.avatar || "/default-avatar.png"}
                name={site.author?.name || site.title}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-sm"
              />
            </div>
            {/* 呼吸状态灯 */}
            <div className="absolute bottom-1 right-1 flex items-center justify-center p-1 bg-surface rounded-full shadow-xs">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-success" />
              </span>
            </div>
          </div>

          {/* 中间核心文字与理念 */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3">
            {/* 顶栏徽章 */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
              <RiSparklingFill className="text-xs" />
              <span>温润自然 · 极简思考与技术沉淀</span>
            </div>

            {/* 标题与问候 */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {site.author?.name || site.title}
              <span className="text-muted text-lg md:text-xl font-normal ml-2">
                — {site.description || "心中有景，花香满径"}
              </span>
            </h1>

            {/* 个性签名/格言 */}
            <p className="text-xs md:text-sm text-muted leading-relaxed max-w-2xl">
              记录前端工程、设计系统、全栈技术与日常生活感悟。追求克制、温和且富有人文质感的数字造物。
            </p>

            {/* 快捷数据统计徽章流 */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-default/50 text-xs text-foreground/80 font-medium">
                <RiArticleLine className="text-accent text-sm" />
                <span>{articles.length} 篇技术博文</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-default/50 text-xs text-foreground/80 font-medium">
                <RiFolderLine className="text-accent text-sm" />
                <span>{categories.length} 个技术专栏</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-default/50 text-xs text-foreground/80 font-medium">
                <RiHeartPulseLine className="text-accent text-sm" />
                <span>稳定运行 {daysRunning} 天</span>
              </div>
            </div>

            {/* 操作按钮组 */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                color="primary"
                variant="solid"
                size="sm"
                onClick={onExploreArticles}
                className="rounded-xl px-4 font-semibold text-xs shadow-xs"
              >
                <RiCompass3Line className="text-sm mr-1" />
                探索博文
              </Button>
              <Button
                variant="flat"
                size="sm"
                onClick={() => onNavigate && onNavigate("/me")}
                className="rounded-xl px-4 text-xs font-medium"
              >
                关于作者
              </Button>
              {site.author?.github && (
                <a
                  href={site.author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-default/60 transition-colors"
                  title="访问 GitHub 主页"
                >
                  <RiGithubFill className="text-lg" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
