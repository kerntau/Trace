import React, { useState } from "react";
import { Card, Input, Textarea, Switch, Button } from "@trace/ui";
import { RiSaveLine, RiArrowLeftLine } from "react-icons/ri";

export interface ArticleEditProps {
  initialArticle?: any;
  onBack: () => void;
  onSaved: () => void;
}

export const ArticleEdit: React.FC<ArticleEditProps> = ({ initialArticle, onBack, onSaved }) => {
  const [title, setTitle] = useState(initialArticle?.title || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [category, setCategory] = useState(initialArticle?.category || "💎 默认分类");
  const [tags, setTags] = useState(
    Array.isArray(initialArticle?.tags) ? initialArticle.tags.join(", ") : "ThriveX"
  );
  const [description, setDescription] = useState(initialArticle?.description || "");
  const [isDraft, setIsDraft] = useState(Boolean(initialArticle?.isDraft));
  const [isTop, setIsTop] = useState(Boolean(initialArticle?.isTop));
  const [content, setContent] = useState(initialArticle?.rawContent || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("请输入文章标题");
      return;
    }

    setSaving(true);
    try {
      const tagList = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialArticle?.id,
          slug: slug.trim() || undefined,
          title,
          description,
          category,
          tags: tagList,
          isDraft,
          isTop,
          content,
          createTime: initialArticle?.createTime
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("文章已成功保存至本地 content/articles 目录！");
        onSaved();
      } else {
        alert("保存失败: " + data.message);
      }
    } catch (e: any) {
      alert("保存请求失败: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="light"
          size="sm"
          startContent={<RiArrowLeftLine />}
          onClick={onBack}
          className="font-medium text-xs text-default-500 rounded-xl"
        >
          返回文章列表
        </Button>
        <Button
          color="primary"
          variant="shadow"
          size="sm"
          startContent={<RiSaveLine className="text-base" />}
          onClick={handleSave}
          isLoading={saving}
          className="rounded-xl font-bold text-xs h-9 px-5 shadow-primary/20"
        >
          {saving ? "正在保存..." : "保存文章"}
        </Button>
      </div>

      {/* Meta Form Card */}
      <Card className="border border-divider/60 bg-content1/80 p-6 rounded-3xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="文章标题"
            placeholder="请输入文章标题"
            value={title}
            onValueChange={setTitle}
            variant="bordered"
            size="sm"
            classNames={{ inputWrapper: "rounded-xl" }}
          />
          <Input
            label="自定义 Slug (URL 路径)"
            placeholder="例如: my-first-post (留空自动生成)"
            value={slug}
            onValueChange={setSlug}
            variant="bordered"
            size="sm"
            classNames={{ inputWrapper: "rounded-xl" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="所属分类"
            placeholder="例如: 技术分享"
            value={category}
            onValueChange={setCategory}
            variant="bordered"
            size="sm"
            classNames={{ inputWrapper: "rounded-xl" }}
          />
          <Input
            label="文章标签 (逗号分隔)"
            placeholder="React, TypeScript, Rsbuild"
            value={tags}
            onValueChange={setTags}
            variant="bordered"
            size="sm"
            classNames={{ inputWrapper: "rounded-xl" }}
          />
        </div>

        <Textarea
          label="文章摘要 / 描述"
          placeholder="简要概括文章内容（用于 SEO 与卡片展示）..."
          value={description}
          onValueChange={setDescription}
          variant="bordered"
          minRows={2}
          classNames={{ inputWrapper: "rounded-xl" }}
        />

        <div className="flex items-center gap-8 pt-2">
          <Switch isSelected={isDraft} onValueChange={setIsDraft} size="sm">
            <span className="text-xs font-semibold text-foreground">存为草稿 (不发布在前台)</span>
          </Switch>

          <Switch isSelected={isTop} onValueChange={setIsTop} size="sm" color="warning">
            <span className="text-xs font-semibold text-foreground">置顶推荐</span>
          </Switch>
        </div>
      </Card>

      {/* Markdown Dual-Pane Editor */}
      <Card className="border border-divider/60 bg-content1/80 p-6 rounded-3xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground">Markdown / MDX 正文编写</label>
          <span className="text-[11px] text-default-400">支持 GFM 表格、公式与代码高亮</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[520px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在此处输入 Markdown 正文..."
            className="w-full h-full p-4 rounded-2xl border border-divider/60 bg-content2/40 font-mono text-xs focus:outline-none focus:border-primary resize-none leading-relaxed text-foreground"
          />
          <div className="h-full p-4 rounded-2xl bg-content2/20 border border-divider/60 overflow-y-auto font-sans text-xs leading-relaxed text-foreground">
            <div className="text-[10px] text-default-400 font-bold mb-3 uppercase tracking-wider">
              实时预览
            </div>
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{content}</pre>
          </div>
        </div>
      </Card>
    </div>
  );
};
