import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeCallouts from "rehype-callouts";
import rehypeStringify from "rehype-stringify";
import matter from "gray-matter";
import { Article, ArticleFrontmatter } from "@trace/config";
import { calculateReadingTime, slugify } from "@trace/utils";
import { extractToc } from "./toc";

export interface ParseMarkdownOptions {
  slug?: string;
  defaultCategory?: string;
}

export async function parseMarkdown(rawContent: string, options: ParseMarkdownOptions = {}): Promise<Article> {
  const parsedMatter = matter(rawContent);
  const data = parsedMatter.data as Partial<ArticleFrontmatter>;
  const content = parsedMatter.content;

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight as any, { ignoreMissing: true })
    .use(rehypeKatex as any)
    .use(rehypeCallouts as any)
    .use(rehypeStringify);

  const vfile = await processor.process(content);
  const html = String(vfile);

  const title = data.title || "未命名文章";
  const slug = options.slug || slugify(title) || String(data.id || Date.now());
  const toc = extractToc(content);
  const readingTime = calculateReadingTime(content);

  return {
    id: data.id || slug,
    slug,
    title,
    description: data.description || "",
    cover: data.cover || "",
    category: data.category || options.defaultCategory || "未分类",
    tags: Array.isArray(data.tags) ? data.tags : [],
    createTime: data.createTime || Date.now(),
    updateTime: data.updateTime,
    isDraft: Boolean(data.isDraft),
    isTop: Boolean(data.isTop),
    encrypt: data.encrypt,
    seo: data.seo,
    views: data.views || 0,
    likes: data.likes || 0,
    content: html,
    toc,
    readingTime
  };
}

export function stringifyFrontmatter(frontmatter: ArticleFrontmatter, content: string): string {
  return matter.stringify(content, frontmatter);
}
