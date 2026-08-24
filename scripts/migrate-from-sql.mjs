import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const sqlPath = path.join(workspaceRoot, "ThriveX-Server-master", "ThriveX.sql");
const contentDir = path.join(workspaceRoot, "content");
const articlesDir = path.join(contentDir, "articles");
const pagesDir = path.join(contentDir, "pages");
const recordsDir = path.join(contentDir, "records");
const configDir = path.join(contentDir, "config");

[articlesDir, pagesDir, recordsDir, configDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log("Reading SQL dump from:", sqlPath);
const sql = fs.readFileSync(sqlPath, "utf-8");

function stringifyFrontmatter(data, content) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => JSON.stringify(v)).join(", ")}]`);
    } else if (typeof value === "object") {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (typeof value === "string") {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push("---");
  lines.push("");
  lines.push(content);
  return lines.join("\n");
}

// 提取文章
const articleMatches = sql.match(/INSERT INTO `article` VALUES ([\s\S]*?);/);
if (articleMatches) {
  const insertContent = articleMatches[1];
  const regex = /\((\d+),\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g;
  
  let match;
  while ((match = regex.exec(insertContent)) !== null) {
    const id = match[1];
    const title = match[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const description = match[3].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const content = match[4].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\\\/g, "\\");
    const cover = match[5] ? match[5].replace(/\\'/g, "'") : "";
    const views = parseInt(match[6], 10);
    const createTime = Number(match[10]);

    const frontmatter = {
      id: Number(id),
      title,
      description,
      cover,
      category: "💎 默认分类",
      tags: ["ThriveX"],
      createTime: createTime || Date.now(),
      isDraft: false,
      isTop: false,
      views: views || 0,
      likes: 0
    };

    const fileContent = stringifyFrontmatter(frontmatter, content);
    const fileName = `article-${id}.md`;
    fs.writeFileSync(path.join(articlesDir, fileName), fileContent, "utf-8");
    console.log(`Exported article: ${fileName} - ${title}`);
  }
}

// 提取足迹
const footprintMatches = sql.match(/INSERT INTO `footprint` VALUES ([\s\S]*?);/);
const footprints = [];
if (footprintMatches) {
  const fRegex = /\((\d+),\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*(\d+)\)/g;
  let fMatch;
  while ((fMatch = fRegex.exec(footprintMatches[1])) !== null) {
    const coords = fMatch[5].split(",").map(Number);
    footprints.push({
      id: Number(fMatch[1]),
      title: fMatch[2],
      description: fMatch[3],
      location: fMatch[4],
      coordinates: coords.length === 2 ? coords : [121.499718, 31.239703],
      cover: "",
      date: new Date(Number(fMatch[7])).toISOString().split("T")[0]
    });
  }
}
fs.writeFileSync(path.join(pagesDir, "footprint.json"), JSON.stringify(footprints, null, 2), "utf-8");

// 提取里程碑
const milestoneMatches = sql.match(/INSERT INTO `milestone` VALUES ([\s\S]*?);/);
const milestones = [];
if (milestoneMatches) {
  const mRegex = /\((\d+),\s*'((?:\\.|[^'])*)',\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(\d+)\)/g;
  let mMatch;
  while ((mMatch = mRegex.exec(milestoneMatches[1])) !== null) {
    milestones.push({
      id: Number(mMatch[1]),
      title: mMatch[2],
      description: mMatch[3] ? mMatch[3].replace(/\\n/g, "\n") : "",
      cover: mMatch[4] || "",
      date: new Date(Number(mMatch[6])).toISOString().split("T")[0]
    });
  }
}
fs.writeFileSync(path.join(pagesDir, "milestones.json"), JSON.stringify(milestones, null, 2), "utf-8");

// 提取说说 record
const recordMatches = sql.match(/INSERT INTO `record` VALUES ([\s\S]*?);/);
const records = [];
if (recordMatches) {
  const rRegex = /\((\d+),\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*(\d+),\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(\d+)\)/g;
  let rMatch;
  while ((rMatch = rRegex.exec(recordMatches[1])) !== null) {
    records.push({
      id: Number(rMatch[1]),
      content: rMatch[2],
      likes: Number(rMatch[4]),
      mood: rMatch[5] || "",
      location: rMatch[6] || "",
      createTime: Number(rMatch[7])
    });
  }
}
fs.writeFileSync(path.join(recordsDir, "records.json"), JSON.stringify(records, null, 2), "utf-8");

// 提取友链 link
const linkMatches = sql.match(/INSERT INTO `link` VALUES ([\s\S]*?);/);
const friends = [];
if (linkMatches) {
  const lRegex = /\((\d+),\s*'((?:\\.|[^'])*)',\s*'((?:\\.|[^'])*)',\s*(?:'((?:\\.|[^'])*)'|NULL),\s*'((?:\\.|[^'])*)',\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(?:'((?:\\.|[^'])*)'|NULL),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g;
  let lMatch;
  while ((lMatch = lRegex.exec(linkMatches[1])) !== null) {
    friends.push({
      id: Number(lMatch[1]),
      name: lMatch[2],
      desc: lMatch[3],
      avatar: lMatch[5],
      link: lMatch[6] || "",
      order: Number(lMatch[8])
    });
  }
}
fs.writeFileSync(path.join(pagesDir, "friends.json"), JSON.stringify(friends, null, 2), "utf-8");

// 提取自定义页面 page_config (my, resume, equipment)
const pageConfigMatches = sql.match(/INSERT INTO `page_config` VALUES ([\s\S]*?);/);
if (pageConfigMatches) {
  const pRegex = /\((\d+),\s*'((?:\\.|[^'])*)',\s*'(\{[\s\S]*?\})',\s*'((?:\\.|[^'])*)'\)/g;
  let pMatch;
  while ((pMatch = pRegex.exec(pageConfigMatches[1])) !== null) {
    const pageKey = pMatch[2];
    try {
      const parsedJson = JSON.parse(pMatch[3].replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
      fs.writeFileSync(path.join(pagesDir, `${pageKey}.json`), JSON.stringify(parsedJson, null, 2), "utf-8");
      console.log(`Exported page config: ${pageKey}.json`);
    } catch (e) {
      console.error(`Failed to parse page config ${pageKey}:`, e.message);
    }
  }
}

// 写入 site.config.json 与 theme.config.json
const siteConfig = {
  title: "ThriveX",
  subtitle: "简而不简单的现代化博客管理系统",
  description: "ThriveX 是一个基于 React 19 + Rsbuild + MDX + 本地 CMS 构建的极速纯静态博客。",
  url: "https://liuyuyang.net",
  logo: "https://bu.dusays.com/2024/11/17/6739adf188f64.png",
  favicon: "/favicon.ico",
  author: {
    name: "刘宇阳",
    avatar: "https://bu.dusays.com/2024/11/17/6739adf188f64.png",
    description: "02 年全栈开发工程师，ThriveX 博客系统创始人与开源爱好者。",
    email: "liuyuyang1024@yeah.net",
    github: "https://github.com/LiuYuYang01",
    socials: [
      { name: "GitHub", icon: "RiGithubFill", url: "https://github.com/LiuYuYang01" },
      { name: "My", icon: "RiUser3Fill", url: "https://my.liuyuyang.net" },
      { name: "Email", icon: "RiMailFill", url: "mailto:liuyuyang1024@yeah.net" }
    ]
  },
  navMenu: [
    { title: "首页", path: "/", icon: "RiHome5Line" },
    { title: "文章", path: "/article", icon: "RiBookOpenLine" },
    { title: "分类", path: "/cate", icon: "RiFolderLine" },
    { title: "标签", path: "/tags", icon: "RiPriceTag3Line" },
    { title: "说说", path: "/record", icon: "RiChatSmile2Line" },
    { title: "足迹", path: "/footprint", icon: "RiFootprintLine" },
    { title: "里程碑", path: "/milestone", icon: "RiFlagLine" },
    { title: "友链", path: "/friend", icon: "RiLinksLine" },
    { title: "装备", path: "/equipment", icon: "RiMacbookLine" },
    { title: "关于", path: "/my", icon: "RiUser3Line" }
  ],
  footer: {
    copyright: "© 2026 刘宇阳 (LiuYuYang). All Rights Reserved.",
    sinceYear: 2019,
    customText: "Powered by ThriveX SSG & Rsbuild"
  },
  seo: {
    keywords: ["ThriveX", "刘宇阳", "前端开发", "React 19", "Rsbuild", "博客系统", "SSG"]
  }
};

const themeConfig = {
  primaryColor: "#539dfd",
  darkMode: "system",
  enableAnimation: true,
  banner: {
    enable: true,
    title: "ThriveX Blog",
    subtitles: [
      "半山腰的风景很美，然而我还是更想到山顶去看看",
      "不谋全局者，不足谋一域",
      "追求极致的性能与极简的工程架构"
    ],
    typedSpeed: 80,
    showArrow: true
  },
  heroCard: {
    enable: true,
    recommendArticles: [2, 15, 16],
    techStack: [
      { name: "React 19", icon: "RiReactjsLine" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "Rsbuild", icon: "SiRspack" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" }
    ]
  }
};

fs.writeFileSync(path.join(configDir, "site.config.json"), JSON.stringify(siteConfig, null, 2), "utf-8");
fs.writeFileSync(path.join(configDir, "theme.config.json"), JSON.stringify(themeConfig, null, 2), "utf-8");

console.log("Migration finished successfully!");
