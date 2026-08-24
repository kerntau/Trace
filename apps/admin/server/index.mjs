import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

const PORT = 3001;
const rootDir = path.resolve(process.cwd(), "../../content");
const fallbackRootDir = path.resolve(process.cwd(), "content");
const contentRoot = fs.existsSync(rootDir) ? rootDir : fallbackRootDir;
const assetsDir = path.resolve(process.cwd(), "../../public/assets");

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 辅助函数：解析 Frontmatter
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent };
  }
  const yaml = match[1];
  const content = match[2];
  const data = {};

  const lines = yaml.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();

    if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      try {
        data[key] = JSON.parse(rawVal);
      } catch {
        data[key] = rawVal.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
      }
    } else if (rawVal.startsWith('"') && rawVal.endsWith('"')) {
      data[key] = JSON.parse(rawVal);
    } else if (rawVal === "true") {
      data[key] = true;
    } else if (rawVal === "false") {
      data[key] = false;
    } else if (!isNaN(Number(rawVal)) && rawVal !== "") {
      data[key] = Number(rawVal);
    } else {
      data[key] = rawVal;
    }
  }

  return { data, content };
}

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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  try {
    // 1. 获取所有文章
    if (req.method === "GET" && pathname === "/api/articles") {
      const articlesDir = path.join(contentRoot, "articles");
      const list = [];
      if (fs.existsSync(articlesDir)) {
        const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
        for (const file of files) {
          const raw = fs.readFileSync(path.join(articlesDir, file), "utf-8");
          const { data, content } = parseFrontmatter(raw);
          const slug = file.replace(/\.(md|mdx)$/, "");
          list.push({
            slug,
            ...data,
            rawContent: content
          });
        }
      }
      sendJson(res, 200, { success: true, data: list });
      return;
    }

    // 2. 保存/创建文章
    if (req.method === "POST" && pathname === "/api/articles") {
      const body = await readBody(req);
      const { slug, title, description, category, tags, isDraft, isTop, content } = body;

      const fileSlug = slug || `article-${Date.now()}`;
      const frontmatter = {
        id: body.id || Date.now(),
        title: title || "未命名文章",
        description: description || "",
        category: category || "💎 默认分类",
        tags: Array.isArray(tags) ? tags : [],
        createTime: body.createTime || Date.now(),
        updateTime: Date.now(),
        isDraft: Boolean(isDraft),
        isTop: Boolean(isTop),
        views: body.views || 0,
        likes: body.likes || 0
      };

      const fileData = stringifyFrontmatter(frontmatter, content || "");
      const articlesDir = path.join(contentRoot, "articles");
      if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir, { recursive: true });

      const targetPath = path.join(articlesDir, `${fileSlug}.md`);
      fs.writeFileSync(targetPath, fileData, "utf-8");

      sendJson(res, 200, { success: true, message: "文章保存成功", slug: fileSlug });
      return;
    }

    // 3. 删除文章
    if (req.method === "DELETE" && pathname.startsWith("/api/articles/")) {
      const slug = decodeURIComponent(pathname.replace("/api/articles/", ""));
      const targetPath = path.join(contentRoot, "articles", `${slug}.md`);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      sendJson(res, 200, { success: true, message: "文章已删除" });
      return;
    }

    // 4. 读写配置 (site, theme)
    if (pathname.startsWith("/api/config/")) {
      const configKey = pathname.replace("/api/config/", "");
      const configPath = path.join(contentRoot, "config", `${configKey}.config.json`);

      if (req.method === "GET") {
        if (fs.existsSync(configPath)) {
          const cfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          sendJson(res, 200, { success: true, data: cfg });
        } else {
          sendJson(res, 404, { success: false, message: "Config not found" });
        }
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        fs.writeFileSync(configPath, JSON.stringify(body, null, 2), "utf-8");
        sendJson(res, 200, { success: true, message: "配置更新成功" });
        return;
      }
    }

    // 5. 读写说说
    if (pathname === "/api/records") {
      const recordsPath = path.join(contentRoot, "records", "records.json");
      if (req.method === "GET") {
        const list = fs.existsSync(recordsPath) ? JSON.parse(fs.readFileSync(recordsPath, "utf-8")) : [];
        sendJson(res, 200, { success: true, data: list });
        return;
      }
      if (req.method === "POST") {
        const body = await readBody(req);
        fs.writeFileSync(recordsPath, JSON.stringify(body, null, 2), "utf-8");
        sendJson(res, 200, { success: true, message: "说说已更新" });
        return;
      }
    }

    // 6. 触发一键静态构建
    if (req.method === "POST" && pathname === "/api/build") {
      console.log("[CMS] Triggering Static Site Generation...");
      const monorepoRoot = path.resolve(contentRoot, "..");
      exec("pnpm --filter=@trace/web build", { cwd: monorepoRoot }, (error, stdout, stderr) => {
        if (error) {
          sendJson(res, 500, { success: false, message: "构建失败", log: stderr || error.message });
        } else {
          sendJson(res, 200, { success: true, message: "静态站点生成完毕！", log: stdout });
        }
      });
      return;
    }

    sendJson(res, 404, { success: false, message: "Not Found" });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { success: false, message: err.message });
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`[ThriveX Local CMS Server] Port ${PORT} already active.`);
  } else {
    console.error("Server error:", err);
  }
});

server.listen(PORT, () => {
  console.log(`[ThriveX Local CMS Server] Running on http://localhost:${PORT}`);
});
