import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { ThemeConfig } from "@trace/config";
import { Button, Chip } from "@trace/ui";
import {
  RiArrowDownLine,
  RiSparklingFill,
  RiRocketLine,
  RiCompass3Line,
  RiBookOpenLine
} from "react-icons/ri";

export interface BannerProps {
  theme: ThemeConfig;
  onScrollDown?: () => void;
  onExploreArticles?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ theme, onScrollDown, onExploreArticles }) => {
  const typedEl = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);

  useEffect(() => {
    if (typedEl.current && theme.banner?.subtitles?.length) {
      typedInstance.current = new Typed(typedEl.current, {
        strings: theme.banner.subtitles,
        typeSpeed: theme.banner.typedSpeed || 65,
        backSpeed: 35,
        backDelay: 2200,
        loop: true,
        showCursor: true,
        cursorChar: " ▎"
      });
    }

    return () => {
      typedInstance.current?.destroy();
    };
  }, [theme.banner?.subtitles]);

  if (!theme.banner?.enable) return null;

  return (
    <div className="relative w-full min-h-[520px] md:min-h-[580px] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden select-none">
      {/* Aurora Ambient Mesh Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[340px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-pink-500/20 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse duration-1000" />

      {/* Top Floating Badge */}
      <div className="mb-5 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-foreground shadow-xs border border-primary/20 hover:border-primary/40 transition-all cursor-default">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span>心中有景,花香满径</span>
          <span className="text-default-400">|</span>
          <span className="text-primary font-bold">Trace Blog</span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-5 text-foreground">
        <span className="text-gradient-primary">
          {theme.banner.title || "kerntau"}
        </span>
      </h1>

      {/* Dynamic Subtitle with Typed.js */}
      <div className="text-base sm:text-lg md:text-xl text-default-600 dark:text-default-400 font-normal min-h-[40px] max-w-2xl mx-auto leading-relaxed mb-8">
        <span ref={typedEl} className="font-medium" />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Button
          color="primary"
          variant="solid"
          size="md"
          radius="full"
          startContent={<RiBookOpenLine className="text-base" />}
          onClick={onScrollDown}
          className="font-bold px-6 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          探索文章
        </Button>
        <Button
          variant="flat"
          color="default"
          size="md"
          radius="full"
          as="a"
          href="/friend"
          startContent={<RiCompass3Line className="text-base text-primary" />}
          className="font-medium px-5 glass-panel"
        >
          技术朋友圈
        </Button>
      </div>

      {/* Scroll Indicator */}
      {theme.banner.showArrow && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer" onClick={onScrollDown}>
          <div className="flex flex-col items-center gap-1 text-[11px] text-default-400 hover:text-primary transition-colors">
            <span>SCROLL</span>
            <RiArrowDownLine className="text-lg animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
};
