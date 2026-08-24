import React from "react";
import { GlobalContentData } from "@trace/config";
import { Avatar, Button } from "@trace/ui";
import {
  RiGithubFill,
  RiMailLine,
  RiCpuLine,
  RiStackLine,
  RiFolderLine
} from "react-icons/ri";

export interface MyPageProps {
  data: GlobalContentData;
}

export const MyPage: React.FC<MyPageProps> = ({ data }) => {
  const author = data.site.author;

  const skills = [
    { name: "React 19 / Modern Web", level: "核心架构演进" },
    { name: "TypeScript 5.8", level: "严格类型系统" },
    { name: "Tailwind CSS v4", level: "设计系统与语义令牌" },
    { name: "Rsbuild / Rspack", level: "现代化构建工程" },
    { name: "Rust / WASM", level: "高性能系统工程" },
    { name: "Go / Microservices", level: "高并发服务与后端" },
  ];

  return (
    <div className="min-h-screen bg-subtle-grid pt-24 pb-20 px-4">
      <div className="max-w-[880px] mx-auto space-y-6">
        {/* 作者主卡片 */}
        <div className="gentle-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
            <Avatar
              src={author?.avatar || "/default-avatar.png"}
              name={author?.name || "kerntau"}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-sm ring-2 ring-accent/30 shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {author?.name || "kerntau"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">
                  全栈工程师 / 开源探索者
                </span>
              </div>

              <p className="text-xs md:text-sm text-muted leading-relaxed mb-4">
                {author?.description || "追求温润克制、极简纯粹的数字美学，热爱代码架构与现代 Web 技术沉淀。"}
              </p>

              {/* 快捷按钮 */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {author?.github && (
                  <Button
                    size="sm"
                    variant="flat"
                    as="a"
                    href={author.github}
                    target="_blank"
                    className="rounded-xl text-xs font-semibold"
                  >
                    <RiGithubFill className="text-base mr-1" />
                    GitHub 主页
                  </Button>
                )}
                {author?.email && (
                  <Button
                    size="sm"
                    variant="flat"
                    as="a"
                    href={`mailto:${author.email}`}
                    className="rounded-xl text-xs font-semibold"
                  >
                    <RiMailLine className="text-base text-accent mr-1" />
                    发送邮件
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 技能与信条 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 技术栈雷达图谱 (7 Col) */}
          <div className="md:col-span-7 gentle-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/70 font-bold text-sm text-foreground">
                <RiStackLine className="text-accent text-base" /> 技术栈矩阵
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {skills.map((s) => (
                  <div
                    key={s.name}
                    className="p-3 rounded-2xl bg-default/40 flex flex-col"
                  >
                    <span className="font-bold text-xs text-foreground mb-0.5">{s.name}</span>
                    <span className="text-[10px] text-muted">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border/70 text-[11px] text-muted flex items-center justify-between">
              <span>Modern Web & Systems</span>
              <span className="text-success font-semibold">Continuous Learning</span>
            </div>
          </div>

          {/* 架构与设计信条 (5 Col) */}
          <div className="md:col-span-5 gentle-card rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/70 font-bold text-sm text-foreground">
                <RiCpuLine className="text-accent text-base" /> 架构与设计信条
              </div>

              <ul className="space-y-3 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">01.</span>
                  <span><strong className="text-foreground">KISS 原则</strong>：真实复杂度出现前，拒绝过度工程与无谓抽象。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">02.</span>
                  <span><strong className="text-foreground">内容即代码</strong>：文件即单一事实数据源 (GitOps & File-First)。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">03.</span>
                  <span><strong className="text-foreground">温润自然</strong>：拒绝高刺激光效，追求耐看与呼吸感排版。</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-border/70 text-[11px] text-accent font-semibold flex items-center gap-1">
              <RiFolderLine /> Trace Monorepo 5.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
