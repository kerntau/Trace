<div align="center">

# TRACE // CONTENT MONOREPO

**博客前台、管理后台与共享设计包的 Turborepo**<br>
*A content-first monorepo for the web and its admin tools.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111111)](https://react.dev)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
![License](https://img.shields.io/badge/License-See%20repository-555555?style=for-the-badge)

</div>

---

## 01. THE PURPOSE // 项目本源

Trace 是一个内容优先的博客与个人主页 monorepo，包含面向访客的静态 Web、管理后台和共享 UI/Markdown/主题包。

[Repository](https://github.com/kerntau/Trace)

## 02. CORE ARCHITECTURE // 核心架构

~~~mermaid
graph TD
  C[content/] --> W[apps/web build-data]
  M[packages/markdown] --> W
  T[packages/theme + ui] --> W
  W --> S[SSG prerender]
  C --> A[apps/admin]
  A --> C
~~~

apps/web 在构建前生成内容数据并进行静态预渲染；apps/admin 通过本地服务编辑内容；packages 提供共享能力。

## 03. TECHNICAL MATRIX // 技术矩阵

| 层 | 技术 | 责任 |
| --- | --- | --- |
| Workspace | pnpm、Turborepo | 包管理与任务编排 |
| Apps | React 19、Rsbuild、HeroUI | web 与 admin |
| Styling | Tailwind CSS v4 | 设计令牌与布局 |
| Packages | markdown、theme、ui、utils、config | 共享运行时能力 |
| Validation | TypeScript、lint、typecheck | 工程校验 |

## 04. REPOSITORY TOPOLOGY // 源码拓扑

~~~text
apps/web/              # 前台、内容构建与 SSG
apps/admin/            # 管理后台和本地 API
packages/config/       # 站点配置
packages/markdown/     # Markdown/MDX 处理
packages/theme/        # 主题令牌和布局
packages/ui/           # 共享组件
packages/utils/        # 通用工具
content/               # 文章与站点内容
DESIGN_SYSTEM.md       # 视觉交互规范
~~~

## 05. CLONE & QUICK START // 极速开始

需要 Node.js 20+ 与 pnpm 10.5+。

~~~bash
git clone https://github.com/kerntau/Trace.git
cd Trace
pnpm install
pnpm dev
~~~

单独启动：

~~~bash
pnpm dev:web
pnpm dev:admin
~~~

## 06. DEPLOYMENT & VERIFICATION // 部署与验证

~~~bash
pnpm build
pnpm build:web
pnpm build:admin
pnpm lint
pnpm typecheck
~~~

apps/web 构建会生成内容数据并执行静态预渲染；部署前验证文章、分类、标签、友链和后台内容写入。

## 07. ENGINEERING CONTRACT // 工程契约

- 共享组件和主题变量优先放入 packages/，避免跨 app 重复实现。
- 内容 schema 变化必须同步 web 构建与 admin 编辑器。
- 新增依赖需评估 bundle 体积、可访问性和安全影响。
- 以 DESIGN_SYSTEM.md 作为视觉令牌与交互约束的来源。

## 08. ROADMAP // 演进路线

- [x] web/admin 双应用与共享包
- [x] 内容构建、SSG 和设计系统
- [ ] 更完善的内容预览与发布流水线
- [ ] 跨应用的权限与审计记录

## 09. LICENSE // 许可证

仓库当前未附 LICENSE 文件，各包的许可证声明需在分发前明确。
