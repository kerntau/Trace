# Trace

一个以内容为中心的博客与个人主页 monorepo，包含静态 Web 前台、管理后台和共享设计/内容包。

## 组成

- apps/web/：面向访客的 React 博客前台，支持内容构建、SSG 预渲染、文章/分类/标签/友链等页面
- apps/admin/：React 管理后台，提供本地开发服务器和内容管理界面
- packages/config/：站点与主题配置
- packages/markdown/：Markdown/MDX 处理
- packages/theme/：主题令牌和布局
- packages/ui/：共享 UI 组件
- packages/utils/：通用工具
- content/：文章及站点内容
- DESIGN_SYSTEM.md：视觉与交互设计规范

## 技术栈

React 19 · TypeScript · Rsbuild · Tailwind CSS v4 · HeroUI · Framer Motion · Turborepo · pnpm。

## 环境要求

Node.js 20+ 与 pnpm 10.5+。

## 开发

~~~bash
pnpm install

# 同时启动前台与后台
pnpm dev

# 仅启动前台
pnpm dev:web

# 仅启动后台
pnpm dev:admin
~~~

## 构建和检查

~~~bash
pnpm build
pnpm build:web
pnpm build:admin
pnpm lint
pnpm typecheck
~~~

前台构建会先生成内容数据，再执行 Rsbuild 构建与静态预渲染。后台的 dev:server、dev:client 可分别启动服务端和客户端。

## 内容与设计

请将文章和媒体放入 content/，共享展示逻辑优先放入 packages/。新增组件时同步更新设计系统文档，并保持主题变量和可访问性约束。

## 许可证

以仓库中的许可证与各包声明为准。
