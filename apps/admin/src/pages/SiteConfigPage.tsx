import React, { useState, useEffect } from "react";
import { Card, Input, Textarea, Button, Divider } from "@trace/ui";
import { RiSaveLine } from "react-icons/ri";

export const SiteConfigPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config/site")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setConfig(res.data);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        alert("网站配置保存成功！");
      }
    } catch (e: any) {
      alert("保存失败: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <div className="text-xs text-default-400">正在加载配置...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">网站设置</h1>
          <p className="text-xs text-default-400 mt-1">全局站点基础信息 (content/config/site.config.json)</p>
        </div>
        <Button
          color="primary"
          variant="shadow"
          size="sm"
          startContent={<RiSaveLine className="text-base" />}
          onClick={handleSave}
          isLoading={saving}
          className="rounded-xl font-bold text-xs h-9 px-5 shadow-primary/20"
        >
          {saving ? "正在保存..." : "保存配置"}
        </Button>
      </div>

      <Card className="border border-divider/60 bg-content1/80 p-6 rounded-3xl shadow-xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="网站标题"
              value={config.title || ""}
              onValueChange={(v) => setConfig({ ...config, title: v })}
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "rounded-xl" }}
            />
            <Input
              label="副标题"
              value={config.subtitle || ""}
              onValueChange={(v) => setConfig({ ...config, subtitle: v })}
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "rounded-xl" }}
            />
          </div>

          <Textarea
            label="网站描述 (SEO Meta Description)"
            value={config.description || ""}
            onValueChange={(v) => setConfig({ ...config, description: v })}
            variant="bordered"
            minRows={2}
            classNames={{ inputWrapper: "rounded-xl" }}
          />
        </div>

        <Divider />

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground">作者与联系方式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="作者姓名"
              value={config.author?.name || ""}
              onValueChange={(v) =>
                setConfig({ ...config, author: { ...config.author, name: v } })
              }
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "rounded-xl" }}
            />
            <Input
              label="联系邮箱"
              value={config.author?.email || ""}
              onValueChange={(v) =>
                setConfig({ ...config, author: { ...config.author, email: v } })
              }
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "rounded-xl" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
