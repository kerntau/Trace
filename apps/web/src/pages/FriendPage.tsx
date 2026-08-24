import React, { useState } from "react";
import { GlobalContentData } from "@trace/config";
import { Avatar, Button } from "@trace/ui";
import {
  RiLinksLine,
  RiSearch2Line,
  RiSendPlaneLine,
  RiExternalLinkLine,
  RiFileCopyLine,
  RiCheckLine,
  RiSparklingFill
} from "react-icons/ri";

export interface FriendPageProps {
  data: GlobalContentData;
  onNavigate?: (path: string) => void;
}

export const FriendPage: React.FC<FriendPageProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const friends = data.friendLinks || [];

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase())
  );

  const copyConfig = (format: "yaml" | "json") => {
    const configData = format === "yaml"
      ? `- name: kerntau\n  desc: 心中有景，花香满径\n  link: https://trace.dev\n  avatar: https://trace.dev/avatar.webp`
      : JSON.stringify({
          name: "kerntau",
          desc: "心中有景，花香满径",
          link: "https://trace.dev",
          avatar: "https://trace.dev/avatar.webp"
        }, null, 2);

    navigator.clipboard.writeText(configData);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="min-h-screen bg-subtle-grid pt-24 pb-20 px-4">
      <div className="max-w-[1240px] mx-auto">
        {/* 顶部标题区 */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
            <RiSparklingFill className="text-xs" /> 友链空间 · Friends Radar
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            海内存知己，天涯若比邻
          </h1>
          <p className="text-xs md:text-sm text-muted leading-relaxed mb-6">
            记录常看常新的技术伙伴与开源探索者
          </p>

          {/* 搜索框 */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="搜索博主名称或简介..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-2xl gentle-card text-xs text-foreground placeholder:text-muted/70 focus:outline-none focus:border-accent transition"
            />
            <RiSearch2Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
          </div>
        </div>

        {/* 友链网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {filteredFriends.map((friend) => (
            <a
              key={friend.id}
              href={friend.link}
              target="_blank"
              rel="noopener noreferrer"
              className="gentle-card rounded-3xl p-5 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <Avatar
                    src={friend.avatar}
                    name={friend.name}
                    className="w-11 h-11 rounded-full ring-2 ring-accent/20 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-foreground group-hover:text-accent transition-colors truncate">
                        {friend.name}
                      </span>
                      <RiExternalLinkLine className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <span className="text-[11px] text-muted truncate">
                      {friend.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-2">
                  {friend.desc || "保持好奇与热情，探索广阔的技术世界。"}
                </p>
              </div>

              <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted">
                <span>ONLINE</span>
                <span className="text-accent font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  访问站点 <RiExternalLinkLine className="text-xs" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* 友链申请卡片 */}
        <div className="gentle-card rounded-3xl p-8 max-w-2xl mx-auto text-center">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <RiSendPlaneLine className="text-accent" /> 友链申请与配置互换
          </h3>
          <p className="text-xs text-muted mb-6 max-w-md mx-auto">
            欢迎技术博主交换友链！点击下方按钮可一键复制本站配置信息。
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Button
              size="sm"
              variant="flat"
              onClick={() => copyConfig("yaml")}
              className="rounded-xl text-xs"
            >
              {copiedFormat === "yaml" ? <RiCheckLine className="text-success mr-1" /> : <RiFileCopyLine className="mr-1" />}
              {copiedFormat === "yaml" ? "已复制 YAML 配置" : "复制 YAML 配置"}
            </Button>
            <Button
              size="sm"
              variant="flat"
              onClick={() => copyConfig("json")}
              className="rounded-xl text-xs"
            >
              {copiedFormat === "json" ? <RiCheckLine className="text-success mr-1" /> : <RiFileCopyLine className="mr-1" />}
              {copiedFormat === "json" ? "已复制 JSON 配置" : "复制 JSON 配置"}
            </Button>
          </div>

          <Button
            color="primary"
            size="sm"
            as="a"
            href="mailto:hi@trace.dev?subject=友链申请"
            className="rounded-xl font-semibold px-6"
          >
            发送申请邮件
          </Button>
        </div>
      </div>
    </div>
  );
};
