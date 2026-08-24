import { SiteConfig, ThemeConfig } from "./types";

export const defaultSiteConfig: SiteConfig = {
  title: "Trace",
  subtitle: "简而不简单的现代化博客系统",
  description: "基于 React 19 + Rsbuild + MDX + 本地 CMS 打造的极速纯静态博客",
  url: "https://example.com",
  logo: "/assets/logo.png",
  favicon: "/favicon.ico",
  author: {
    name: "Trace Author",
    avatar: "https://bu.dusays.com/2024/11/17/6739adf188f64.png",
    description: "全栈工程师，热爱技术与开源分享。",
    email: "author@example.com",
    github: "https://github.com",
    socials: [
      { name: "GitHub", icon: "RiGithubFill", url: "https://github.com" },
      { name: "Email", icon: "RiMailFill", url: "mailto:author@example.com" }
    ]
  },
  navMenu: [
    { title: "首页", path: "/", icon: "RiHome5Line" },
    { title: "文章", path: "/article", icon: "RiBookOpenLine" },
    { title: "分类", path: "/cate", icon: "RiFolderLine" },
    { title: "标签", path: "/tags", icon: "RiPriceTag3Line" },
    { title: "说说", path: "/record", icon: "RiChatSmile2Line" },
    { title: "足迹", path: "/footprint", icon: "RiFootprintLine" },
    { title: "友链", path: "/friend", icon: "RiLinksLine" },
    { title: "关于", path: "/my", icon: "RiUser3Line" }
  ],
  footer: {
    copyright: "© 2026 Trace. All Rights Reserved.",
    sinceYear: 2024,
    customText: "Powered by Trace SSG"
  },
  seo: {
    keywords: ["Trace", "React 19", "Rsbuild", "Blog", "SSG", "Markdown"]
  }
};

export const defaultThemeConfig: ThemeConfig = {
  primaryColor: "#3b82f6",
  darkMode: "system",
  enableAnimation: true,
  banner: {
    enable: true,
    title: "Trace",
    subtitles: [
      "探索技术，记录思考，分享生活",
      "追求极致的性能与极简的工程架构"
    ],
    typedSpeed: 80,
    showArrow: true
  },
  heroCard: {
    enable: true,
    recommendArticles: [],
    techStack: [
      { name: "React 19", icon: "RiReactjsLine" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "Rsbuild", icon: "SiRspack" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" }
    ]
  }
};
