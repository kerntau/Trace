import React, { useState, useEffect } from "react";
import { HeroProvider } from "@trace/ui";
import { AdminLayout } from "./components/AdminLayout";
import { Dashboard } from "./pages/Dashboard";
import { ArticleList } from "./pages/ArticleList";
import { ArticleEdit } from "./pages/ArticleEdit";
import { RecordManage } from "./pages/RecordManage";
import { SiteConfigPage } from "./pages/SiteConfigPage";
import { ThemeConfigPage } from "./pages/ThemeConfigPage";

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [articles, setArticles] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const fetchAll = () => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setArticles(res.data);
      })
      .catch(() => {});

    fetch("/api/records")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setRecords(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleTriggerBuild = async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    try {
      const res = await fetch("/api/build", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("🎉 静态站点已成功生成 (apps/web/dist)！");
      } else {
        alert("构建异常: " + (data.log || data.message));
      }
    } catch (e: any) {
      alert("构建请求失败: " + e.message);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleEditArticle = (art: any) => {
    setEditingArticle(art);
    setCurrentTab("create");
  };

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setCurrentTab("create");
  };

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <Dashboard
            articles={articles}
            records={records}
            onNavigate={(tab, extra) => {
              if (tab === "create" && extra) {
                handleEditArticle(extra);
              } else if (tab === "create") {
                handleCreateArticle();
              } else {
                setCurrentTab(tab);
              }
            }}
            onTriggerBuild={handleTriggerBuild}
            isBuilding={isBuilding}
          />
        );
      case "articles":
        return (
          <ArticleList
            articles={articles}
            onEdit={handleEditArticle}
            onCreate={handleCreateArticle}
            onRefresh={fetchAll}
          />
        );
      case "create":
        return (
          <ArticleEdit
            initialArticle={editingArticle}
            onBack={() => setCurrentTab("articles")}
            onSaved={() => {
              fetchAll();
              setCurrentTab("articles");
            }}
          />
        );
      case "records":
        return <RecordManage records={records} onRefresh={fetchAll} />;
      case "site":
        return <SiteConfigPage />;
      case "theme":
        return <ThemeConfigPage />;
      default:
        return <Dashboard articles={articles} records={records} onNavigate={setCurrentTab} onTriggerBuild={handleTriggerBuild} isBuilding={isBuilding} />;
    }
  };

  return (
    <HeroProvider>
      <AdminLayout
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === "create") setEditingArticle(null);
          setCurrentTab(tab);
        }}
        onTriggerBuild={handleTriggerBuild}
        isBuilding={isBuilding}
      >
        {renderContent()}
      </AdminLayout>
    </HeroProvider>
  );
};
