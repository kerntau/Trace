import React, { useState } from "react";
import {
  Card,
  Input,
  Chip,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@trace/ui";
import { RiEditLine, RiDeleteBinLine, RiAddLine, RiSearchLine } from "react-icons/ri";

export interface ArticleListProps {
  articles: any[];
  onEdit: (article: any) => void;
  onCreate: () => void;
  onRefresh: () => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, onEdit, onCreate, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [filterDraft, setFilterDraft] = useState<string>("all");

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) || a.category?.includes(search);
    const matchDraft =
      filterDraft === "all" ? true : filterDraft === "draft" ? a.isDraft : !a.isDraft;
    return matchSearch && matchDraft;
  });

  const handleDelete = async (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("确定要删除此文章吗？文件将从 content/articles 中移除。")) return;
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message);
      }
    } catch (e: any) {
      alert("删除失败: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">文章管理</h1>
          <p className="text-xs text-default-400 mt-1">本地 Markdown 知识库 ({articles.length} 篇)</p>
        </div>
        <Button
          color="primary"
          variant="shadow"
          size="sm"
          startContent={<RiAddLine className="text-base" />}
          onClick={onCreate}
          className="rounded-xl font-bold text-xs h-9 px-4 shadow-primary/20"
        >
          撰写新文章
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="border border-divider/60 bg-content1/80 p-4 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Input
            size="sm"
            placeholder="搜索文章标题或分类..."
            value={search}
            onValueChange={setSearch}
            startContent={<RiSearchLine className="text-default-400 text-sm" />}
            className="w-full sm:w-80"
            classNames={{
              inputWrapper: "rounded-xl border-divider/60"
            }}
          />

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              size="sm"
              variant={filterDraft === "all" ? "solid" : "flat"}
              color={filterDraft === "all" ? "primary" : "default"}
              onClick={() => setFilterDraft("all")}
              className="text-xs rounded-xl h-8"
            >
              全部
            </Button>
            <Button
              size="sm"
              variant={filterDraft === "published" ? "solid" : "flat"}
              color={filterDraft === "published" ? "primary" : "default"}
              onClick={() => setFilterDraft("published")}
              className="text-xs rounded-xl h-8"
            >
              已发布
            </Button>
            <Button
              size="sm"
              variant={filterDraft === "draft" ? "solid" : "flat"}
              color={filterDraft === "draft" ? "primary" : "default"}
              onClick={() => setFilterDraft("draft")}
              className="text-xs rounded-xl h-8"
            >
              草稿箱
            </Button>
          </div>
        </div>
      </Card>

      {/* Articles Table */}
      <Card className="border border-divider/60 bg-content1/80 p-2 rounded-3xl shadow-xs overflow-hidden">
        <Table aria-label="Article Table" removeWrapper className="w-full">
          <TableHeader>
            <TableColumn className="text-xs font-bold">标题</TableColumn>
            <TableColumn className="text-xs font-bold">分类</TableColumn>
            <TableColumn className="text-xs font-bold">状态</TableColumn>
            <TableColumn className="text-xs font-bold">创建时间</TableColumn>
            <TableColumn align="end" className="text-xs font-bold text-right">
              操作
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="暂无符合条件的文章">
            {filtered.map((art) => (
              <TableRow
                key={art.slug}
                className="cursor-pointer hover:bg-default-100/60 transition"
                onClick={() => onEdit(art)}
              >
                <TableCell>
                  <div>
                    <div className="font-bold text-sm text-foreground hover:text-primary transition truncate max-w-xs">
                      {art.title}
                    </div>
                    <div className="text-[10px] text-default-400 font-mono mt-0.5">{art.slug}.md</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-default-600 font-medium">
                    {art.category || "💎 默认分类"}
                  </span>
                </TableCell>
                <TableCell>
                  {art.isDraft ? (
                    <Chip size="sm" variant="flat" color="warning" className="text-[10px]">
                      草稿
                    </Chip>
                  ) : (
                    <Chip size="sm" variant="flat" color="success" className="text-[10px]">
                      已发布
                    </Chip>
                  )}
                </TableCell>
                <TableCell className="text-xs text-default-400 font-mono">
                  {new Date(Number(art.createTime) || Date.now()).toISOString().split("T")[0]}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onClick={() => onEdit(art)}
                      className="rounded-lg"
                    >
                      <RiEditLine className="text-base" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={(e) => handleDelete(art.slug, e)}
                      className="rounded-lg"
                    >
                      <RiDeleteBinLine className="text-base" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
