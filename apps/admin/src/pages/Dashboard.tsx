import React from "react";
import { Card, CardHeader, CardBody, Chip, Button, Divider } from "@trace/ui";
import {
  RiArticleLine,
  RiChatSmile2Line,
  RiGlobalLine,
  RiExternalLinkLine,
  RiAddLine,
  RiDraftLine
} from "react-icons/ri";

export interface DashboardProps {
  articles: any[];
  records: any[];
  onNavigate: (tab: string, extra?: any) => void;
  onTriggerBuild: () => void;
  isBuilding: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  articles,
  records,
  onNavigate,
  onTriggerBuild,
  isBuilding
}) => {
  const publishedArticles = articles.filter((a) => !a.isDraft);
  const draftArticles = articles.filter((a) => a.isDraft);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">工作台控制面板</h1>
          <p className="text-xs text-default-400 mt-1">欢迎使用 ThriveX 本地内容管理与静态构建工作台</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            as="a"
            href="http://localhost:9001"
            target="_blank"
            rel="noreferrer"
            variant="flat"
            size="sm"
            endContent={<RiExternalLinkLine />}
            className="rounded-xl font-medium text-xs h-9 px-3.5"
          >
            预览前台
          </Button>
          <Button
            color="primary"
            variant="shadow"
            size="sm"
            startContent={<RiAddLine className="text-base" />}
            onClick={() => onNavigate("create")}
            className="rounded-xl font-semibold text-xs h-9 px-4 shadow-primary/20"
          >
            撰写新文章
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-divider/60 bg-content1/80 p-4 rounded-3xl shadow-xs">
          <CardBody className="flex flex-row items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary flex items-center justify-center text-2xl shadow-xs">
              <RiArticleLine />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{publishedArticles.length}</div>
              <div className="text-xs text-default-400">已发布文章</div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider/60 bg-content1/80 p-4 rounded-3xl shadow-xs">
          <CardBody className="flex flex-row items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-warning-50 dark:bg-warning-950/40 text-warning flex items-center justify-center text-2xl shadow-xs">
              <RiDraftLine />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{draftArticles.length}</div>
              <div className="text-xs text-default-400">草稿箱</div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider/60 bg-content1/80 p-4 rounded-3xl shadow-xs">
          <CardBody className="flex flex-row items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-success-50 dark:bg-success-950/40 text-success flex items-center justify-center text-2xl shadow-xs">
              <RiChatSmile2Line />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{records.length}</div>
              <div className="text-xs text-default-400">闪念说说</div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider/60 bg-content1/80 p-4 rounded-3xl shadow-xs">
          <CardBody className="flex flex-row items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 text-secondary flex items-center justify-center text-2xl shadow-xs">
              <RiGlobalLine />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">纯静态</div>
              <div className="text-xs text-default-400">零服务器维护</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Articles */}
      <Card className="border border-divider/60 bg-content1/80 p-4 rounded-3xl shadow-xs">
        <CardHeader className="flex items-center justify-between px-3 py-2 border-b border-divider/60">
          <h2 className="text-sm font-bold text-foreground">最近文章</h2>
          <Button
            size="sm"
            variant="light"
            color="primary"
            onClick={() => onNavigate("articles")}
            className="text-xs h-7 px-2.5"
          >
            查看全部
          </Button>
        </CardHeader>

        <CardBody className="p-2 divide-y divide-divider/40">
          {articles.slice(0, 5).map((art) => (
            <div
              key={art.slug}
              className="py-3 px-3 flex items-center justify-between gap-4 hover:bg-default-100/60 rounded-2xl transition cursor-pointer"
              onClick={() => onNavigate("create", art)}
            >
              <div className="min-w-0">
                <div className="text-sm font-bold text-foreground truncate">{art.title}</div>
                <div className="text-xs text-default-400 flex items-center gap-2 mt-0.5 font-mono">
                  <span>{art.category || "未分类"}</span>
                  <span>•</span>
                  <span>{new Date(Number(art.createTime) || Date.now()).toISOString().split("T")[0]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {art.isDraft ? (
                  <Chip size="sm" variant="flat" color="warning" className="text-[10px]">
                    草稿
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat" color="success" className="text-[10px]">
                    已发布
                  </Chip>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};
