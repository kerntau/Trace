import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const sqlPath = path.join(workspaceRoot, "ThriveX-Server-master", "ThriveX.sql");
const articlesDir = path.join(workspaceRoot, "content", "articles");

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

const sql = fs.readFileSync(sqlPath, "utf-8");

// 找到 INSERT INTO `article` VALUES 后面的所有内容直到分号
const startStr = "INSERT INTO `article` VALUES ";
const startIndex = sql.indexOf(startStr);
if (startIndex !== -1) {
  const endIndex = sql.indexOf(";\n", startIndex);
  const valuesSql = sql.substring(startIndex + startStr.length, endIndex).trim();

  // 用状态机/词法解析 SQL values 块
  const rows = [];
  let inString = false;
  let escape = false;
  let currentVal = "";
  let currentRow = [];
  let inRow = false;

  for (let i = 0; i < valuesSql.length; i++) {
    const char = valuesSql[i];

    if (escape) {
      if (char === "n") currentVal += "\n";
      else if (char === "r") currentVal += "\r";
      else if (char === "t") currentVal += "\t";
      else if (char === "'") currentVal += "'";
      else if (char === '"') currentVal += '"';
      else if (char === "\\") currentVal += "\\";
      else currentVal += char;
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (char === "'" && !inString) {
      inString = true;
      continue;
    }

    if (char === "'" && inString) {
      inString = false;
      continue;
    }

    if (inString) {
      currentVal += char;
      continue;
    }

    if (char === "(" && !inRow) {
      inRow = true;
      currentRow = [];
      currentVal = "";
      continue;
    }

    if (char === "," && inRow) {
      currentRow.push(currentVal.trim());
      currentVal = "";
      continue;
    }

    if (char === ")" && inRow) {
      currentRow.push(currentVal.trim());
      rows.push(currentRow);
      inRow = false;
      currentVal = "";
      continue;
    }

    currentVal += char;
  }

  console.log(`Parsed ${rows.length} articles.`);

  for (const row of rows) {
    const id = Number(row[0]);
    const title = row[1];
    const description = row[2] === "NULL" ? "" : row[2];
    const content = row[3];
    const cover = row[4] === "NULL" ? "" : row[4];
    const views = Number(row[5]) || 0;
    const createTime = Number(row[9]) || Date.now();

    const lines = ["---"];
    lines.push(`id: ${id}`);
    lines.push(`title: ${JSON.stringify(title)}`);
    lines.push(`description: ${JSON.stringify(description)}`);
    lines.push(`cover: ${JSON.stringify(cover)}`);
    lines.push(`category: ${JSON.stringify("💎 默认分类")}`);
    lines.push(`tags: ["ThriveX"]`);
    lines.push(`createTime: ${createTime}`);
    lines.push(`isDraft: false`);
    lines.push(`isTop: ${id === 2}`);
    lines.push(`views: ${views}`);
    lines.push(`likes: 0`);
    lines.push("---");
    lines.push("");
    lines.push(content);

    const fileName = `article-${id}.md`;
    fs.writeFileSync(path.join(articlesDir, fileName), lines.join("\n"), "utf-8");
    console.log(`Successfully exported: ${fileName} - ${title}`);
  }
}
