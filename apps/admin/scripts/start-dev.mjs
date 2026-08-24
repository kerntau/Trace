import { createRsbuild, loadConfig } from "@rsbuild/core";
import { fork } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, "../server/index.mjs");
const adminRoot = path.resolve(__dirname, "..");

// 1. 启动本地 CMS API Server
const serverProc = fork(serverPath, {
  cwd: adminRoot,
  stdio: "inherit"
});

// 2. 使用 Rsbuild JS API 启动 Dev Server (Port 9002)
async function startClient() {
  try {
    const { content } = await loadConfig({
      cwd: adminRoot
    });
    const rsbuild = await createRsbuild({
      cwd: adminRoot,
      rsbuildConfig: content
    });
    await rsbuild.startDevServer();
  } catch (err) {
    console.error("Failed to start Admin Dev Server:", err);
  }
}

startClient();

function cleanup() {
  try {
    serverProc.kill();
  } catch {}
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
