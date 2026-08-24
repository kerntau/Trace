import React, { useState } from "react";
import { GlobalContentData, FriendLinkItem } from "@trace/config";
import { Card, CardBody, Avatar, Chip, Button, Input } from "@trace/ui";
import {
  RiLinksLine,
  RiSearch2Line,
  RiSendPlaneLine,
  RiCompass3Line,
  RiSparklingFill,
  RiExternalLinkLine
} from "react-icons/ri";

export interface FriendPageProps {
  data: GlobalContentData;
  onNavigate?: (path: string) => void;
}

export const FriendPage: React.FC<FriendPageProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const friends = data.friendLinks || [];

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-subtle-grid pt-24 pb-20 px-4">
      <div className="max-w-[1240px] mx-auto">
        {/* Header Hero */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <RiCompass3Line /> 朋友圈 (Friends & Feeds)
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3">
            <span className="text-gradient-primary">海内存知己，天涯若比邻</span>
          </h1>
          <p className="text-xs md:text-sm text-default-500 leading-relaxed mb-6">
            这里汇聚了优质的独立博客作者与开源开发者，欢迎常来串门交流。
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="搜索友链博主名称或描述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-2xl glass-panel text-xs text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            <RiSearch2Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-default-400 text-sm" />
          </div>
        </div>

        {/* Friends Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {filteredFriends.map((friend) => (
            <a
              key={friend.id}
              href={friend.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-3xl p-4 md:p-5 flex flex-col justify-between group hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5 mb-3">
                <Avatar
                  src={friend.avatar}
                  className="w-12 h-12 rounded-2xl ring-2 ring-divider/50 group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {friend.name}
                    </span>
                    <RiExternalLinkLine className="text-xs text-default-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <span className="text-[11px] text-default-400 truncate">
                    {friend.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </div>
              </div>

              <p className="text-xs text-default-500 line-clamp-2 leading-relaxed h-8">
                {friend.desc || "这位博主很神秘，没有留下详细描述~"}
              </p>
            </a>
          ))}
        </div>

        {/* Apply Section */}
        <div className="glass-card rounded-3xl p-8 max-w-3xl mx-auto border border-divider/70 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <RiSendPlaneLine className="text-primary" /> 申请友链与互换
          </h3>
          <p className="text-xs text-default-500 mb-6 max-w-lg mx-auto">
            欢迎独立技术博主交换友链！请确保网站能长期稳定访问并具有原创内容。
          </p>

          <div className="bg-default-100/60 dark:bg-default-50/10 p-4 rounded-2xl text-left text-xs font-mono text-default-700 max-w-md mx-auto mb-6 select-all border border-divider/40">
            <div>name: kerntau</div>
            <div>desc: 心中有景,花香满径</div>
            <div>link: https://keru.in</div>
            <div>avatar: https://keru.in/avatar.webp</div>
          </div>

          <Button
            color="primary"
            variant="shadow"
            size="sm"
            as="a"
            href="mailto:hi@keru.in?subject=友链申请"
            className="rounded-xl font-bold px-6 shadow-primary/20"
          >
            发送申请邮件 (hi@keru.in)
          </Button>
        </div>
      </div>
    </div>
  );
};
