import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");
const dataFile = path.resolve(process.cwd(), "src/data/static-data.json");

if (!fs.existsSync(distDir)) {
  console.error("Dist directory not found, skipping SSG prerender.");
  process.exit(0);
}

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("Template index.html not found in dist, skipping SSG prerender.");
  process.exit(0);
}

const template = fs.readFileSync(templatePath, "utf-8");
const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

console.log(`[SSG] Starting Static Site Generation for ${data.articles.length} articles...`);

// 辅助函数：根据路由生成 HTML
function generatePageHtml(pageTitle, pageDesc) {
  let html = template;
  if (pageTitle) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle} | ${data.site.title || "Trace"}</title>`);
  }
  if (pageDesc) {
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${pageDesc}" />`);
  }
  return html;
}

function writeStaticRoute(routePath, html) {
  const cleanRoute = routePath.replace(/^\//, "");
  const targetDir = path.join(distDir, cleanRoute);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf-8");
  console.log(`[SSG] Rendered: /${cleanRoute}/index.html`);
}

// 1. 独立页面
const staticRoutes = [
  { path: "article", title: "文章归档", desc: "全部文章归档列表" },
  { path: "cate", title: "全部分类", desc: "文章分类检索" },
  { path: "tags", title: "全部标签", desc: "文章标签云" },
  { path: "record", title: "闪念说说", desc: "日常随笔与闪念" },
  { path: "footprint", title: "旅行足迹", desc: "探索世界" },
  { path: "milestone", title: "人生里程碑", desc: "重要节点与成长记录" },
  { path: "friend", title: "友链朋友圈", desc: "友情链接" },
  { path: "my", title: "关于我", desc: "作者简介与个人履历" }
];

for (const route of staticRoutes) {
  const html = generatePageHtml(route.title, route.desc);
  writeStaticRoute(route.path, html);
}

// 2. 每篇文章生成独立静态 HTML
for (const art of data.articles) {
  const html = generatePageHtml(art.title, art.description || art.title);
  writeStaticRoute(`article/${art.slug}`, html);
}

// 3. 每个分类生成独立静态 HTML
for (const cate of data.categories) {
  const html = generatePageHtml(`分类: ${cate.name}`, `分类 ${cate.name} 下的文章`);
  writeStaticRoute(`cate/${encodeURIComponent(cate.slug)}`, html);
}

// 4. 每个标签生成独立静态 HTML
for (const tag of data.tags) {
  const html = generatePageHtml(`标签: #${tag.name}`, `包含标签 #${tag.name} 的文章`);
  writeStaticRoute(`tag/${encodeURIComponent(tag.slug)}`, html);
}

// 5. 生成 sitemap.xml
const baseUrl = data.site.url || "https://example.com";
const sitemapUrls = [
  `${baseUrl}/`,
  `${baseUrl}/article`,
  `${baseUrl}/cate`,
  `${baseUrl}/tags`,
  `${baseUrl}/record`,
  `${baseUrl}/footprint`,
  `${baseUrl}/milestone`,
  `${baseUrl}/friend`,
  `${baseUrl}/my`,
  ...data.articles.map((a) => `${baseUrl}/article/${a.slug}`)
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");

// 6. 生成 robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(distDir, "robots.txt"), robotsTxt, "utf-8");

console.log("[SSG] Prerender completed successfully! Sitemap and robots.txt generated.");
