import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Article, Category, Tag, RecordItem, FootprintItem, MilestoneItem, FriendLinkItem, GlobalContentData, SiteConfig, ThemeConfig } from "@trace/config";
import { parseMarkdown } from "@trace/markdown";
import staticData from "./static-data.json";

export function loadGlobalData(): GlobalContentData {
  return staticData as unknown as GlobalContentData;
}

export async function loadAllContent(baseDir?: string): Promise<GlobalContentData> {
  const root = baseDir || path.resolve(process.cwd(), "../../content");
  const fallbackRoot = path.resolve(process.cwd(), "content");
  const contentRoot = fs.existsSync(root) ? root : fallbackRoot;

  const configDir = path.join(contentRoot, "config");
  const articlesDir = path.join(contentRoot, "articles");
  const recordsDir = path.join(contentRoot, "records");
  const pagesDir = path.join(contentRoot, "pages");

  // 1. 读取站点与主题配置
  const siteConfig: SiteConfig = fs.existsSync(path.join(configDir, "site.config.json"))
    ? JSON.parse(fs.readFileSync(path.join(configDir, "site.config.json"), "utf-8"))
    : {};

  const themeConfig: ThemeConfig = fs.existsSync(path.join(configDir, "theme.config.json"))
    ? JSON.parse(fs.readFileSync(path.join(configDir, "theme.config.json"), "utf-8"))
    : {};

  // 2. 读取文章
  const articles: Article[] = [];
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(articlesDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const slug = file.replace(/\.(md|mdx)$/, "");
      const article = await parseMarkdown(raw, { slug });
      articles.push(article);
    }
  }

  // 排序文章（置顶在前，时间降序）
  articles.sort((a, b) => {
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    return Number(b.createTime) - Number(a.createTime);
  });

  // 3. 聚合分类与标签
  const cateMap = new Map<string, number>();
  const tagMap = new Map<string, number>();

  for (const art of articles) {
    if (art.category) {
      cateMap.set(art.category, (cateMap.get(art.category) || 0) + 1);
    }
    if (art.tags && Array.isArray(art.tags)) {
      for (const t of art.tags) {
        tagMap.set(t, (tagMap.get(t) || 0) + 1);
      }
    }
  }

  const categories: Category[] = Array.from(cateMap.entries()).map(([name, count], idx) => ({
    id: idx + 1,
    name,
    slug: name,
    count
  }));

  const tags: Tag[] = Array.from(tagMap.entries()).map(([name, count], idx) => ({
    id: idx + 1,
    name,
    slug: name,
    count
  }));

  // 4. 读取说说
  const records: RecordItem[] = fs.existsSync(path.join(recordsDir, "records.json"))
    ? JSON.parse(fs.readFileSync(path.join(recordsDir, "records.json"), "utf-8"))
    : [];

  // 5. 读取足迹
  const footprints: FootprintItem[] = fs.existsSync(path.join(pagesDir, "footprint.json"))
    ? JSON.parse(fs.readFileSync(path.join(pagesDir, "footprint.json"), "utf-8"))
    : [];

  // 6. 读取里程碑
  const milestones: MilestoneItem[] = fs.existsSync(path.join(pagesDir, "milestones.json"))
    ? JSON.parse(fs.readFileSync(path.join(pagesDir, "milestones.json"), "utf-8"))
    : [];

  // 7. 读取友链
  const friendLinks: FriendLinkItem[] = fs.existsSync(path.join(pagesDir, "friends.json"))
    ? JSON.parse(fs.readFileSync(path.join(pagesDir, "friends.json"), "utf-8"))
    : [];

  return {
    site: siteConfig,
    theme: themeConfig,
    articles,
    categories,
    tags,
    records,
    footprints,
    milestones,
    friendLinks,
    wallMessages: []
  };
}
