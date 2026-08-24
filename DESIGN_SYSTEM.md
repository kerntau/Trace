# Trace 全站设计系统与全页面视觉交互设计规范报告

> 版本：v5.0.0  
> 风格代号：温润自然与极简主义 (Gentle Nature & Minimalism)  
> 技术基底：Tailwind CSS v4 · HeroUI v3 · OKLCH 色彩空间 · Framer Motion · Rsbuild SSG  

---

## 目录 (Table of Contents)

1. [核心设计哲学与原则](#1-核心设计哲学与原则)
2. [色彩与多主题系统规范](#2-色彩与多主题系统规范)
3. [空间、圆角与度量系统](#3-空间圆角与度量系统)
4. [材质、毛玻璃与光感体系](#4-材质毛玻璃与光感体系)
5. [排版、字体与正文规范](#5-排版字体与正文规范)
6. [动效、微交互与过渡曲线](#6-动效微交互与过渡曲线)
7. [全站各页面详细设计规范](#7-全站各页面详细设计规范)
   - 7.1 [首页 (HomePage) 详细设计规范](#71-首页-homepage-详细设计规范)
   - 7.2 [文章详情页 (ArticleDetailPage) 详细设计规范](#72-文章详情页-articledetailpage-详细设计规范)
   - 7.3 [文章归档时间线页 (ArticleListPage) 详细设计规范](#73-文章归档时间线页-articlelistpage-详细设计规范)
   - 7.4 [专栏分类页 (CategoryPage) 详细设计规范](#74-专栏分类页-categorypage-详细设计规范)
   - 7.5 [标签索引页 (TagPage) 详细设计规范](#75-标签索引页-tagpage-详细设计规范)
   - 7.6 [友链空间页 (FriendPage) 详细设计规范](#76-友链空间页-friendpage-详细设计规范)
   - 7.7 [关于作者与作品集页 (MyPage) 详细设计规范](#77-关于作者与作品集页-mypage-详细设计规范)
8. [全局功能组件与模态规范](#8-全局功能组件与模态规范)
   - 8.1 [悬浮置顶导航栏 (Navbar)](#81-悬浮置顶导航栏-navbar)
   - 8.2 [⌘K 智能全局搜索面板 (SearchCommandModal)](#82-k-智能全局搜索面板-searchcommandmodal)
   - 8.3 [莫兰迪多色系切换器 (ThemePaletteSelector)](#83-莫兰迪多色系切换器-themepaletteselector)
   - 8.4 [移动端抽屉导航 (MobileDrawer)](#84-移动端抽屉导航-mobiledrawer)
   - 8.5 [全局温润页脚 (Footer)](#85-全局温润页脚-footer)
9. [管理后台扩展一致性规范 (Admin Extension)](#9-管理后台扩展一致性规范-admin-extension)
10. [工程落地对照表与代码映射](#10-工程落地对照表与代码映射)

---

## 1. 核心设计哲学与原则

Trace 设计系统旨在打破传统数码产品中高刺激、强对比与过度动画的审美疲劳，确立**“温润、克制、耐看、以内容为单一中心”**的数字美学标准。

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. 自然温润 (Gentle & Organic)                                              │
│    全面采用低饱和莫兰迪自然色系、漫反射柔和阴影、大圆角与温润微质感         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. 极简呼吸感 (Minimalist Breathing)                                         │
│    剔除一切浮夸装饰性光效与打字机假象，注重留白、黄金行高与无干扰正文排版   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. 确定性交互 (Deterministic Interaction)                                   │
│    轻阻尼微动效、磁吸滑块指示器、全局 ⌘K 秒级响应、全键盘可访问性            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 色彩与多主题系统规范

系统全面依托 **OKLCH 色彩模型** 构建，保证明暗切换及不同显示介质下色彩亮度和色度的感知一致性。

### 2.1 莫兰迪三大自然配色体系

| 色系代号 | 视觉基调 | 亮色基准 (Light Mode) | 暗色基准 (Dark Mode) | 场景定位 |
| :--- | :--- | :--- | :--- | :--- |
| **Sage (鼠尾草绿)** | 自然静谧、护眼温和 | 主色：`oklch(0.58 0.11 145)`<br>底色：暖灰石米白 (`oklch(0.978 0.005 95)`) | 主色：`oklch(0.70 0.09 145)`<br>底色：深苔碳石 (`oklch(0.155 0.008 145)`) | **默认主推**，长期代码与技术阅读 |
| **Terracotta (落日陶土)** | 温暖书卷、人文温度 | 主色：`oklch(0.60 0.135 42)`<br>底色：杏仁暖白 (`oklch(0.976 0.008 65)`) | 主色：`oklch(0.72 0.12 42)`<br>底色：暖炭深灰 (`oklch(0.155 0.01 45)`) | 适合随笔杂谈、文学记录与摄影展示 |
| **Slate (雾霾灰蓝)** | 理性清雅、克制专注 | 主色：`oklch(0.57 0.09 235)`<br>底色：冷燕麦浅灰 (`oklch(0.974 0.005 240)`) | 主色：`oklch(0.70 0.08 235)`<br>底色：石墨冷灰 (`oklch(0.155 0.008 240)`) | 适合底层架构剖析、算法与开源工具沉淀 |

### 2.2 核心语义令牌映射 (Design Tokens)

```css
:root {
  --color-primary: var(--accent);             /* 主强调色 */
  --color-primary-foreground: var(--snow);    /* 强调色前景 */
  --color-background: var(--background);      /* 全局底色 */
  --color-foreground: var(--foreground);      /* 全局正文色 */
  --color-surface: var(--surface);            /* 一级卡片表面 */
  --color-surface-secondary: var(--surface-secondary); /* 嵌套二级表面 */
  --color-muted: var(--muted);                /* 弱化次级文字 */
  --color-border: var(--border);              /* 细微边框与分隔线 */
}
```

---

## 3. 空间、圆角与度量系统

### 3.1 圆角等级阶梯 (Radius Hierarchy)

| 类别 | 尺寸 | 应用组件 |
| :--- | :--- | :--- |
| **Full** | `9999px` | 胶囊按钮、头像、磁吸指示器、状态灯、浮动 HUD |
| **3XL** | `1.5rem (24px)` | 主名片卡 (`ProfileHero`)、文章卡 (`ArticleCard`)、模态弹窗、侧边栏容器 |
| **2XL** | `1.0rem (16px)` | 列表子卡、二级嵌套块、输入框、下拉菜单浮层 |
| **XL** | `0.75rem (12px)` | 按钮 (`Button`)、分类 Pills、代码复制按钮 |
| **LG/MD** | `0.5rem (8px)` | 快捷键徽章 (`Kbd`)、微型标签胶囊 |

### 3.2 深度与漫反射阴影 (Soft Diffused Shadows)

```css
/* 1. 平级卡片静止态 */
box-shadow: 
  0 4px 20px -2px rgba(0, 0, 0, 0.03),
  0 1px 3px 0 rgba(0, 0, 0, 0.01);

/* 2. 交互悬浮提升态 */
box-shadow: 
  0 12px 30px -4px rgba(0, 0, 0, 0.06),
  0 2px 8px 0 rgba(0, 0, 0, 0.02);

/* 3. 顶置 Dock 与 ⌘K 弹窗 */
box-shadow: 
  0 16px 40px -8px rgba(0, 0, 0, 0.08),
  0 4px 12px -2px rgba(0, 0, 0, 0.03);
```

---

## 4. 材质、毛玻璃与光感体系

1. **温润毛玻璃材质 (.fluid-dock-shell / .gentle-card)**：
   - 模糊基准：`backdrop-filter: blur(20px)`。
   - 混色透光率：`82% ~ 88%` 表面色 + `12% ~ 18%` 背景透出。
   - 边框：`1px solid var(--border)` 消除突兀描边，与背景自然交融。
2. **点阵呼吸底纹 (.bg-subtle-grid)**：
   - 间距 `24px * 24px`，透明度 `4%` 的微径向点阵，赋予空间轻微进深。

---

## 5. 排版、字体与正文规范

### 5.1 字体家族阶梯

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

### 5.2 黄金排版参数

- **正文字号**：`15px / 16px`。
- **正文行高**：`1.75`（`leading-relaxed`），保证长时间阅读不疲劳。
- **段落间距**：`1.25rem (20px)`。
- **沉浸阅读宽度**：`780px`（单行约 50-70 个中文字符）。

---

## 6. 动效、微交互与过渡曲线

- **全局缓动曲线**：Apple / Linear 级标准平滑贝塞尔曲线 `cubic-bezier(0.16, 1, 0.3, 1)`。
- **悬浮微位移**：`transform: translateY(-2px)`。
- **响应速度**：
  - 微交互反馈：`200ms ~ 250ms`
  - 面板与抽屉开合：`250ms ~ 300ms`
  - 色彩与明暗切换：`250ms`

---

## 7. 全站各页面详细设计规范

---

### 7.1 首页 (HomePage) 详细设计规范

#### 1. 页面目标与信息层级
首页是博客的门面与核心导流入口。摒弃全屏打字机与刺激性光效，采用 **“优雅作者 Profile 名片 + 沉浸精选专栏雷达 + 柔和双栏博文流”**。

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. ProfileHero 作者温润名片 (头像 + 理念 + 3维统计指标 + 动作)│
├─────────────────────────────────────────────────────────────┤
│ 2. HeroFeatured 空间 Bento (8col 置顶好文卡 + 4col 专栏雷达) │
├──────────────────────────────────────────────┬──────────────┤
│ 3. 主内容区: 分类过滤 Pills + 博文列表流     │ 4. 侧边栏    │
│    - 分类 Tab Pills (全部/专栏A/专栏B)       │   - 作者信息 │
│    - ArticleCard 列表                        │   - 技术矩阵 │
│    - 分页器 (上一页 / 第 X/Y 页 / 下一页)    │   - 分类/标签│
└──────────────────────────────────────────────┴──────────────┘
```

#### 2. 各区域组件与参数要求
- **ProfileHero (首屏名片区)**：
  - 容器：`gentle-card rounded-3xl p-6 md:p-10`。
  - 头像：`w-24 h-24 md:w-28 md:h-28 rounded-full`，带 `bg-gradient-to-br from-accent/30` 状态环与在线呼吸指示灯。
  - 理念标语：`text-2xl md:text-3xl font-bold`，包含作者名与副标题。
  - 徽章组：包含技术博文篇数、技术专栏数、稳定运行天数。
  - 交互动作：`探索博文`（平滑滚动锚点）、`关于作者`（跳转 `/me`）、`GitHub 直达`。
- **HeroFeatured (精选专栏 Bento)**：
  - 左侧主卡 (8 Col)：置顶深度好文、分类徽章、发布日期、标题 (`text-xl md:text-2xl`)、3行摘要截断、前3个标签微胶囊与“开启阅读”引导。
  - 右侧副卡 (4 Col)：次席推荐博文微卡 + 分类专栏雷达微卡。
- **分类过滤栏与文章流**：
  - 分类 Pills：选中态为 `bg-accent text-accent-foreground font-semibold`，未选中为 `bg-default/50 hover:bg-default`。
  - 文章列表卡片 (`ArticleCard`)：置顶图标、分类胶囊、日期、预估阅读时间、双行截断正文摘要、标签胶囊与悬浮微位移。
  - 侧边栏 (`Sidebar`)：Sticky 粘性吸顶，包含作者缩略卡、技术栈标签流、热门专栏列表与标签云。

---

### 7.2 文章详情页 (ArticleDetailPage) 详细设计规范

#### 1. 页面目标与交互流程
文章详情页是内容消费的核心场景，强调**极致排版、零干扰阅读、多维辅助工具**。

#### 2. 界面结构与核心交互
- **顶部微导流条**：
  - 左侧：`返回首页`（带左箭头微动效）。
  - 右侧：`禅意阅读 (Z)` 开关，支持快捷键 `Z` 瞬间唤起。
- **头部元数据大卡**：
  - 分类徽章与可点击标签流（点击进入对应标签聚合页）。
  - 文章大标题：`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight`。
  - 引用导语/摘要：左侧 `border-l-2 border-accent` 装饰线，斜体弱化呈现。
  - 统计栏：发布时间、阅读预估时间（如 `5 分钟阅读`）、字数统计（如 `2400 字`）。
- **Markdown 渲染区**：
  - 容器样式：`.prose dark:prose-invert`，正文行高 `leading-relaxed`。
  - 代码块：深色背景微圆角，鼠标移入右上角淡出 `一键复制` 按钮，复制后提示 `已复制!` 并在 1.8 秒后复原。
- **粘性目录导航雷达 (TOC)**：
  - 位于右侧 4 Col（大屏自动粘性吸顶，移动端隐藏）。
  - 滚动侦测：根据页面当前滚动位置，实时高亮当前正在阅读的小节（二级、三级目录缩进区分）。
- **版权声明与许可卡片**：
  - CC BY-NC-SA 4.0 许可协议声明，展示文章固定链接。
- **上一篇 / 下一篇双向卡片**：
  - 底部双列网格，平滑引导读者继续探索相关博文。
- **底部浮动 HUD 阅读控制岛**：
  - 居中悬浮：实时显示当前阅读进度百分比（如 `45%`）。
  - 字号调节：提供 `A-`、`A`、`A+` 三档无级调节正文字号。
  - 禅意模式一键切换、一键回到顶部。
- **禅意模式 (Zen Mode)**：
  - 隐藏侧边栏与页首页脚，页面自动居中收缩至 `max-w-[780px]`。
  - 支持 **默认主题**、**暖纸色护眼模式**、**黑曜石深空模式** 专属背景配色切换。

---

### 7.3 文章归档时间线页 (ArticleListPage) 详细设计规范

#### 1. 页面目标与架构
按时间维度直观展现个人技术创作与思考历程。

#### 2. 布局与视觉要素
- **容器与宽度**：`max-w-[840px] mx-auto` 居中单栏。
- **时间轴设计**：
  - 左侧贯穿式时间线：`border-l-2 border-accent/20`。
  - 年份节点大标题：`text-xl font-bold`，左侧悬挂 `w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20` 发光微节点。
- **博文条目卡片**：
  - `gentle-card rounded-2xl p-4`。
  - 左侧等宽日期（如 `2026/08/24`）+ 博文标题。
  - 右侧分类微胶囊徽章。
  - 悬浮时标题平滑变为强调色，整卡微向上位移。

---

### 7.4 专栏分类页 (CategoryPage) 详细设计规范

#### 1. 页面目标
提供按专栏分类沉淀的体系化知识检索。

#### 2. 布局与视觉要素
- **顶部聚合 Pills 栏**：
  - 包含 `全部 (N)` 以及各个技术专栏的胶囊按钮（如 `前端工程化 (12)`、`系统架构 (8)` 等）。
  - 支持 URL 动态匹配 `/category/:category` 或 `/cate/:category`。
- **双列响应式博文网格**：
  - `grid grid-cols-1 md:grid-cols-2 gap-5`。
  - 每个网格渲染一个完整的 `ArticleCard`，展示所属分类、时间、阅读时长与摘要。

---

### 7.5 标签索引页 (TagPage) 详细设计规范

#### 1. 页面目标
提供网状、多维度的标签快速聚合与过滤。

#### 2. 布局与视觉要素
- **标签云选择区**：
  - 标签 Pill 采用 `#标签名 (计数)` 格式。
  - 激活态：`bg-accent text-accent-foreground font-semibold shadow-xs`。
  - 未激活态：`bg-default/50 text-foreground/80 hover:bg-default`。
- **文章列表网格**：
  - 自动联动展示含有该 Tag 的所有文章，点击卡片直接进入正文。

---

### 7.6 友链空间页 (FriendPage) 详细设计规范

#### 1. 页面目标与社交连接
建立与技术博主、开源创作者之间的温润连接。

#### 2. 核心模块组成
- **首屏 Slogan 与即时搜索框**：
  - 标语：“海内存知己，天涯若比邻”。
  - 搜索框：支持按博主名称、简介实时模糊过滤。
- **友链卡片网格**：
  - `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`。
  - 头像带状态光环与在线指示。
  - 域名纯净展示（自动去除 `https://`）。
  - 悬浮右上角浮现外部链接图标 `RiExternalLinkLine`。
- **一键配置互换与邮件申请卡**：
  - 一键复制 `YAML` 配置：包含 name、desc、link、avatar。
  - 一键复制 `JSON` 配置。
  - 复制成功后按钮文字显示绿色打勾反馈（`已复制 YAML 配置`）。
  - 邮件直达按钮（`mailto` 协议）。

---

### 7.7 关于作者与作品集页 (MyPage) 详细设计规范

#### 1. 页面目标
展现作者技术栈全景、工程信条、代表作品与联系方式。

#### 2. 核心模块组成
- **全息作者主名片**：
  - 大尺寸圆形头像 + 状态呼吸光晕。
  - 姓名、身份定位胶囊（“全栈工程师 / 开源探索者”）、个性宣言。
  - 社交按钮组（GitHub 主页、发送邮件等）。
- **技术栈雷达矩阵 (7 Col)**：
  - 双列卡片网格，展示 React 19、TypeScript 5.8、Tailwind v4、Rsbuild、Rust、Go 等核心技术深度。
- **架构与设计三大信条 (5 Col)**：
  - `01. KISS 原则`：真实复杂度出现前，拒绝过度工程与无谓抽象。
  - `02. 内容即代码`：文件即单一事实数据源 (GitOps & File-First)。
  - `03. 温润自然`：拒绝高刺激光效，追求耐看与呼吸感排版。

---

## 8. 全局功能组件与模态规范

---

### 8.1 悬浮置顶导航栏 (Navbar)

- **位置与容器**：`fixed top-0 left-0 right-0 z-40`，外层 `pointer-events-none`，内部容器 `pointer-events-auto`。
- **左侧 Logo 区**：圆形头像 + 站点名称，悬浮轻微缩放。
- **中间磁吸胶囊 Dock**：
  - 包含 `首页`、`文章`、`分类`、`友链`、`关于` 五个主链接。
  - 内部具备 `.dock-pill-indicator` 磁吸滑动指示器，根据当前路由平滑滑入。
- **右侧工具区**：
  - `⌘K` 全局搜索唤起按钮。
  - `ThemePaletteSelector` 莫兰迪色盘与明暗切换。
  - 移动端汉堡菜单触发器。

---

### 8.2 ⌘K 智能全局搜索面板 (SearchCommandModal)

- **唤起热键**：`Cmd+K` (Mac) 或 `Ctrl+K` (Windows/Linux)。
- **搜索输入区**：大图标、无边框透明输入框、ESC 退出徽章。
- **即时检索算法**：同时在文章标题 (`title`)、正文摘要 (`description`)、分类 (`category`)、标签 (`tags`) 中进行多关键词模糊匹配。
- **空状态与快捷导航**：输入为空时，展示首页、归档、专栏、友链、关于作者等快速跳转操作。
- **键盘导航规范**：
  - `↑` / `↓`：在结果列表中上下移动高亮选区。
  - `Enter`：立即跳转并关闭面板。
  - `Esc`：关闭面板。

---

### 8.3 莫兰迪多色系切换器 (ThemePaletteSelector)

- **明暗模式切换**：Sun (明亮) / Moon (暗黑) 图标，平滑过渡。
- **色盘弹出层**：
  - 提供 **鼠尾草绿 (Sage)**、**落日陶土 (Terracotta)**、**雾霾灰蓝 (Slate)** 三款色块直观展示。
  - 选中项展示绿色对勾徽章并实时设置 `data-theme-palette` 与 `localStorage`。

---

### 8.4 移动端抽屉导航 (MobileDrawer)

- **动画与呈现**：移动端底部平滑滑入 (`slide-in-from-bottom`)，带半透明遮罩背景。
- **内容结构**：
  - 顶部作者头像与关闭按钮。
  - `⌘K` 搜索框直达按钮。
  - 各级导航列表（带文章/分类计数徽章）。
  - 底部 GitHub 源码链接。

---

### 8.5 全局温润页脚 (Footer)

- **结构**：极简单栏居中，带细微上边框 `border-t border-border/70`。
- **内容**：站点名称与副标题、版权年份区间、Trace 静态驱动引擎标语。

---

## 9. 管理后台扩展一致性规范 (Admin Extension)

若未来对管理后台 (`@trace/admin`) 进行页面升级，必须完全继承本设计系统规范：
1. **统一调色盘**：使用相同的 `--color-primary`、`--color-surface` 与莫兰迪自然变量。
2. **表单与编辑器**：输入框采用 `rounded-2xl`，Markdown 编辑器采用与前台完全一致的 Typography 字体阶梯与行高。
3. **数据表格与卡片**：表格行悬浮高亮使用 `hover:bg-accent/5`，操作按钮统一采用 `rounded-xl text-xs font-semibold`。

---

## 10. 工程落地对照表与代码映射

| 界面/功能组件 | 对应源码文件位置 | 核心样式类/机制 |
| :--- | :--- | :--- |
| **主题色彩与全局变量** | `packages/theme/src/globals.css` | OKLCH 令牌、`[data-theme-palette]`、`.dark` |
| **主题状态管理与持久化** | `packages/theme/src/index.ts` | `applyTheme()`, `applyPalette()`, `initThemeSystem()` |
| **主导航条 (Dock)** | `apps/web/src/components/Navbar.tsx` | `.fluid-dock-shell`, `.dock-pill-indicator` |
| **⌘K 搜索面板** | `apps/web/src/components/SearchCommandModal.tsx` | `.command-palette-modal`, 键盘事件监听 |
| **莫兰迪调色盘选择器** | `apps/web/src/components/ThemePaletteSelector.tsx` | `.dock-dropdown-card`, 模式/色系实时联动 |
| **移动端导航抽屉** | `apps/web/src/components/MobileDrawer.tsx` | `.mobile-drawer-sheet` |
| **首屏名片组件** | `apps/web/src/components/ProfileHero.tsx` | `.gentle-card`, 3维统计徽章 |
| **精选 Bento 空间** | `apps/web/src/components/HeroFeatured.tsx` | `.gentle-card`, 置顶主卡 + 专栏雷达 |
| **文章卡片** | `apps/web/src/components/ArticleCard.tsx` | `.gentle-card`, 呼吸标签胶囊 |
| **侧边栏** | `apps/web/src/components/Sidebar.tsx` | 技术栈雷达、热门专栏、标签云 |
| **首页** | `apps/web/src/pages/HomePage.tsx` | ProfileHero + HeroFeatured + 双栏文章流 |
| **文章详情页** | `apps/web/src/pages/ArticleDetailPage.tsx` | TOC 目录树、字号调节、禅意阅读模式 (Z) |
| **文章归档时间线** | `apps/web/src/pages/ArticleListPage.tsx` | 年份时间轴、发光微节点 |
| **专栏分类页** | `apps/web/src/pages/CategoryPage.tsx` | 分类 Pills 切换、双列网格 |
| **标签索引页** | `apps/web/src/pages/TagPage.tsx` | 标签云胶囊、关联博文流 |
| **友链空间** | `apps/web/src/pages/FriendPage.tsx` | 友链网格、一键复制配置卡 |
| **关于与作品集** | `apps/web/src/pages/MyPage.tsx` | 技术栈矩阵、架构三大信条 |
| **页脚** | `apps/web/src/components/Footer.tsx` | 极简静谧居中页脚 |
