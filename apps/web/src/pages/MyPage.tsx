import React from "react";
import { GlobalContentData } from "@trace/config";
import { Card, CardHeader, CardBody, Avatar, Chip, Divider } from "@trace/ui";
import { RiSparklingFill, RiCodeSSlashLine, RiRocketLine } from "react-icons/ri";

export interface MyPageProps {
  data: GlobalContentData;
}

export const MyPage: React.FC<MyPageProps> = ({ data }) => {
  const author = data.site.author;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-10 pt-24">
      <Card className="border border-divider/60 bg-content1/90 backdrop-blur-md p-6 md:p-12 rounded-3xl shadow-sm text-center">
        <CardBody className="p-0 flex flex-col items-center">
          <Avatar
            isBordered
            color="primary"
            src={author?.avatar || "https://bu.dusays.com/2024/11/17/6739adf188f64.png"}
            className="w-24 h-24 text-large mb-4 shadow-lg ring-4 ring-primary/20"
          />
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">
            {author?.name}
          </h1>
          <div className="mb-6">
            <Chip
              variant="shadow"
              color="primary"
              size="sm"
              startContent={<RiSparklingFill className="text-xs ml-1" />}
              className="font-semibold"
            >
              全栈工程师 / 开源创作者
            </Chip>
          </div>

          <div className="w-full text-left text-sm md:text-base text-default-700 leading-relaxed space-y-4 max-w-[640px] mx-auto pt-4 border-t border-divider/60">
            <p>
              👋 大家好，我是刘宇阳，代码狂热爱好者与架构探索者。
            </p>
            <p>
              从 2019 年部署第一个网站起，我便踏上全栈探索之路。历经多年技术沉淀，打造了具备极速静态构建、极简工程架构与完整本地 CMS 能力的 <strong>Trace 博客系统</strong>。
            </p>

            <div className="p-5 rounded-2xl bg-content2/50 border border-divider/60 space-y-2 mt-4">
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <RiRocketLine className="text-primary" /> 核心架构理念：
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-default-500 pl-1">
                <li>追求极致的性能与极简的代码架构 (KISS Principle)</li>
                <li>内容即代码 (GitOps & File-First SSOT)</li>
                <li>纯静态化无服务器部署，零常驻维护负担</li>
                <li>基于 React 19 + Rsbuild + HeroUI 现代设计生态</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
