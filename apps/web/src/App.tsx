import React, { useState, useEffect } from "react";
import { GlobalContentData } from "@trace/config";
import { HeroProvider } from "@trace/ui";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { ArticleListPage } from "./pages/ArticleListPage";
import { CategoryPage } from "./pages/CategoryPage";
import { TagPage } from "./pages/TagPage";
import { FriendPage } from "./pages/FriendPage";
import { MyPage } from "./pages/MyPage";

export interface AppProps {
  initialData: GlobalContentData;
  initialPath?: string;
}

export const App: React.FC<AppProps> = ({ initialData, initialPath = "/" }) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      const handlePop = () => {
        setCurrentPath(window.location.pathname);
      };
      window.addEventListener("popstate", handlePop);
      return () => window.removeEventListener("popstate", handlePop);
    }
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderContent = () => {
    // 文章详情: /article/:slug
    if (currentPath.startsWith("/article/")) {
      const slug = decodeURIComponent(currentPath.replace("/article/", ""));
      return <ArticleDetailPage slug={slug} data={initialData} onNavigate={navigate} />;
    }

    // 分类详情: /category/:category 或 /cate/:category
    if (currentPath.startsWith("/category/")) {
      const cate = decodeURIComponent(currentPath.replace("/category/", ""));
      return <CategoryPage data={initialData} activeCategory={cate} onNavigate={navigate} />;
    }
    if (currentPath.startsWith("/cate/")) {
      const cate = decodeURIComponent(currentPath.replace("/cate/", ""));
      return <CategoryPage data={initialData} activeCategory={cate} onNavigate={navigate} />;
    }

    // 标签详情: /tag/:tag
    if (currentPath.startsWith("/tag/")) {
      const tag = decodeURIComponent(currentPath.replace("/tag/", ""));
      return <TagPage data={initialData} activeTag={tag} onNavigate={navigate} />;
    }

    switch (currentPath) {
      case "/":
        return <HomePage data={initialData} onNavigate={navigate} />;
      case "/articles":
      case "/article":
        return <ArticleListPage data={initialData} onNavigate={navigate} />;
      case "/categories":
      case "/cate":
        return <CategoryPage data={initialData} onNavigate={navigate} />;
      case "/tags":
        return <TagPage data={initialData} onNavigate={navigate} />;
      case "/friends":
      case "/friend":
        return <FriendPage data={initialData} onNavigate={navigate} />;
      case "/me":
      case "/my":
        return <MyPage data={initialData} />;
      default:
        return <HomePage data={initialData} onNavigate={navigate} />;
    }
  };

  return (
    <HeroProvider navigate={navigate}>
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent/20 selection:text-accent">
        <Header data={initialData} site={initialData.site} currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">{renderContent()}</main>
        <Footer site={initialData.site} />
      </div>
    </HeroProvider>
  );
};

export default App;
