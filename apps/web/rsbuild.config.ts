import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: "./src/main.tsx"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.dirname(require.resolve("react/package.json")),
      "react-dom": path.dirname(require.resolve("react-dom/package.json"))
    }
  },
  html: {
    template: "./index.html",
    title: "ThriveX - 现代化纯静态博客"
  },
  output: {
    distPath: {
      root: "dist"
    },
    assetPrefix: "/"
  },
  server: {
    port: 9001
  }
});
