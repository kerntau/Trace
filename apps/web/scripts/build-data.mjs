import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

function parseFrontmatter(fileContent) {
  try {
    const res = matter(fileContent);
    return { data: res.data || {}, content: res.content || "" };
  } catch {
    return { data: {}, content: fileContent };
  }
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(content) {
  if (!content) return { words: 0, minutes: 0 };
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*`_~>\-[\]()]/g, "")
    .trim();
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (cleanContent.replace(/[\u4e00-\u9fa5]/g, " ").match(/[a-zA-Z0-9_-]+/g) || []).length;
  const totalWords = chineseChars + englishWords;
  const minutes = Math.max(1, Math.ceil(chineseChars / 350 + englishWords / 160));
  return { words: totalWords, minutes };
}

function extractToc(content) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/[*_~`]/g, "");
    const id = slugify(text) || `heading-${toc.length + 1}`;
    toc.push({ id, text, level });
  }
  return toc;
}

function simpleMarkdownToHtml(markdown) {
  let html = markdown
    .replace(/```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre class="hljs language-${lang}"><code>${escaped}</code></pre>`;
    })
    .replace(/^### (.*$)/gim, (m, t) => `<h3 id="${slugify(t)}">${t}</h3>`)
    .replace(/^## (.*$)/gim, (m, t) => `<h2 id="${slugify(t)}">${t}</h2>`)
    .replace(/^# (.*$)/gim, (m, t) => `<h1 id="${slugify(t)}">${t}</h1>`)
    .replace(/^>\s*\[!note\]\s*(.*)$/gim, '<blockquote class="callout callout-note"><strong>Note:</strong> $1')
    .replace(/^>\s*\[!tip\]\s*(.*)$/gim, '<blockquote class="callout callout-tip"><strong>Tip:</strong> $1')
    .replace(/^>\s*\[!warning\]\s*(.*)$/gim, '<blockquote class="callout callout-warning"><strong>Warning:</strong> $1')
    .replace(/^>\s*(.*)$/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" class="rounded-xl my-4 max-w-full" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br />");

  return `<p>${html}</p>`;
}

async function main() {
  const possibleRoots = [
    path.resolve(process.cwd(), "content"),
    path.resolve(process.cwd(), "../../content"),
    path.resolve(process.cwd(), "../content")
  ];
  const contentRoot = possibleRoots.find((p) => fs.existsSync(p)) || possibleRoots[0];
  console.log(`[BuildData] Using content root: ${contentRoot}`);
  const configDir = path.join(contentRoot, "config");
  const articlesDir = path.join(contentRoot, "articles");
  const recordsDir = path.join(contentRoot, "records");
  const pagesDir = path.join(contentRoot, "pages");

  const siteConfig = fs.existsSync(path.join(configDir, "site.config.json"))
    ? JSON.parse(fs.readFileSync(path.join(configDir, "site.config.json"), "utf-8"))
    : {};

  const themeConfig = fs.existsSync(path.join(configDir, "theme.config.json"))
    ? JSON.parse(fs.readFileSync(path.join(configDir, "theme.config.json"), "utf-8"))
    : {};

  const articles = [];
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(articlesDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = parseFrontmatter(raw);
      const slug = file.replace(/\.(md|mdx)$/, "");
      const toc = extractToc(content);
      const readingTime = calculateReadingTime(content);
      const html = simpleMarkdownToHtml(content);

      // 解析文章分类
      let category = data.category || (Array.isArray(data.categories) && data.categories.length > 0 ? data.categories[0] : "💎 默认分类");
      if (typeof category !== "string" || !category.trim()) {
        category = "💎 默认分类";
      }

      // 解析标签列表
      let tags = [];
      if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (typeof data.tags === "string") {
        tags = [data.tags];
      }

      // 解析封面图
      let cover = data.cover || "";
      if (!cover && Array.isArray(data.images) && data.images.length > 0) {
        cover = data.images[0];
      }

      // 解析创建时间
      let createTime = Date.now();
      if (data.createTime) {
        createTime = typeof data.createTime === "number" ? data.createTime : new Date(data.createTime).getTime() || Date.now();
      } else if (data.date) {
        createTime = new Date(data.date).getTime() || Date.now();
      }

      const updateTime = data.updateTime || data.updated ? new Date(data.updateTime || data.updated).getTime() : undefined;

      articles.push({
        id: data.id || slug,
        slug,
        title: data.title || "未命名文章",
        description: data.description || data.summary || "",
        cover,
        category,
        tags,
        createTime,
        updateTime,
        isDraft: Boolean(data.isDraft || data.draft),
        isTop: Boolean(data.isTop || data.top || (typeof data.recommend === "number" && data.recommend >= 90)),
        views: data.views || 0,
        likes: data.likes || 0,
        content: html,
        toc,
        readingTime
      });
    }
  }

  articles.sort((a, b) => {
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    return Number(b.createTime) - Number(a.createTime);
  });

  const cateMap = new Map();
  const tagMap = new Map();

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

  const categories = Array.from(cateMap.entries()).map(([name, count], idx) => ({
    id: idx + 1,
    name,
    slug: name,
    count
  }));

  const tags = Array.from(tagMap.entries()).map(([name, count], idx) => ({
    id: idx + 1,
    name,
    slug: name,
    count
  }));

  const records = fs.existsSync(path.join(recordsDir, "records.json"))
    ? JSON.parse(fs.readFileSync(path.join(recordsDir, "records.json"), "utf-8"))
    : [];

  const footprints = fs.existsSync(path.join(pagesDir, "footprint.json"))
    ? JSON.parse(fs.readFileSync(path.join(pagesDir, "footprint.json"), "utf-8"))
    : [];

  const milestones = fs.existsSync(path.join(pagesDir, "milestones.json"))
    ? JSON.parse(fs.readFileSync(path.join(pagesDir, "milestones.json"), "utf-8"))
    : [];

  const friendLinks = fs.existsSync(path.join(pagesDir, "friends.json"))
    ? JSON.parse(fs.readFileSync(path.join(pagesDir, "friends.json"), "utf-8"))
    : [];

  const globalData = {
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

  const outDir = path.resolve(process.cwd(), "apps/web/src/data");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, "static-data.json");
  fs.writeFileSync(outFile, JSON.stringify(globalData, null, 2), "utf-8");
  console.log(`[BuildData] Success: Generated static-data.json with ${articles.length} articles!`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
