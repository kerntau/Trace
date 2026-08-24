import React from "react";
import { Button, Card, Divider, Chip } from "@trace/ui";
import {
  RiDashboardLine,
  RiArticleLine,
  RiEditLine,
  RiChatSmile2Line,
  RiSettings4Line,
  RiPaletteLine,
  RiHammerLine,
  RiSparklingFill
} from "react-icons/ri";

export interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onTriggerBuild: () => void;
  isBuilding: boolean;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onTriggerBuild,
  isBuilding,
  children
}) => {
  const menuItems = [
    { key: "dashboard", label: "工作台", icon: <RiDashboardLine className="text-lg" /> },
    { key: "articles", label: "文章管理", icon: <RiArticleLine className="text-lg" /> },
    { key: "create", label: "撰写文章", icon: <RiEditLine className="text-lg" /> },
    { key: "records", label: "说说动态", icon: <RiChatSmile2Line className="text-lg" /> },
    { key: "site", label: "网站设置", icon: <RiSettings4Line className="text-lg" /> },
    { key: "theme", label: "主题外观", icon: <RiPaletteLine className="text-lg" /> }
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-divider/60 bg-content1/80 backdrop-blur-md flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              T
            </div>
            <div>
              <div className="font-extrabold text-foreground text-base tracking-tight leading-tight">
                Trace CMS
              </div>
              <div className="text-[11px] text-default-400">本地内容管理系统</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const active = currentTab === item.key;
              return (
                <Button
                  key={item.key}
                  variant={active ? "flat" : "light"}
                  color={active ? "primary" : "default"}
                  startContent={item.icon}
                  onClick={() => onTabChange(item.key)}
                  className={`w-full justify-start rounded-2xl h-11 px-4 text-xs font-semibold ${
                    active ? "shadow-xs" : "text-default-600"
                  }`}
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Build Trigger Card */}
        <div className="space-y-3 pt-4 border-t border-divider/60">
          <Button
            color="primary"
            variant="shadow"
            onClick={onTriggerBuild}
            disabled={isBuilding}
            isLoading={isBuilding}
            startContent={!isBuilding && <RiHammerLine className="text-base" />}
            className="w-full rounded-2xl font-bold text-xs h-11 shadow-primary/20"
          >
            {isBuilding ? "正在构建 SSG..." : "一键构建静态站点"}
          </Button>
          <div className="text-[10px] text-center text-default-400">
            触发 Rsbuild 静态预渲染
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto">{children}</main>
    </div>
  );
};
