import React, { useState, useEffect } from "react";
import { Card, Input, Textarea, Switch, Button, Divider } from "@trace/ui";
import { RiSaveLine } from "react-icons/ri";

export const ThemeConfigPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config/theme")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setConfig(res.data);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        alert("主题配置保存成功！");
      }
    } catch (e: any) {
      alert("保存失败: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <div className="text-xs text-default-400">正在加载主题配置...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">主题与外观</h1>
          <p className="text-xs text-default-400 mt-1">定制博客前端视觉与动效 (content/config/theme.config.json)</p>
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
          <h2 className="text-sm font-bold text-foreground">Banner 与打字机效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Banner 标题"
              value={config.banner?.title || ""}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  banner: { ...config.banner, title: v }
                })
              }
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "rounded-xl" }}
            />
            <Input
              label="打字速度 (ms)"
              type="number"
              value={String(config.banner?.typedSpeed || 70)}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  banner: { ...config.banner, typedSpeed: Number(v) }
                })
              }
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: "rounded-xl" }}
            />
          </div>

          <Textarea
            label="打字机循环副标题 (每行一句)"
            value={config.banner?.subtitles?.join("\n") || ""}
            onValueChange={(v) =>
              setConfig({
                ...config,
                banner: {
                  ...config.banner,
                  subtitles: v.split("\n").filter(Boolean)
                }
              })
            }
            variant="bordered"
            minRows={3}
            classNames={{ inputWrapper: "rounded-xl" }}
          />

          <div className="pt-2">
            <Switch
              isSelected={Boolean(config.banner?.enable)}
              onValueChange={(v) =>
                setConfig({
                  ...config,
                  banner: { ...config.banner, enable: v }
                })
              }
              size="sm"
            >
              <span className="text-xs font-semibold text-foreground">启用首页大 Banner 视觉区</span>
            </Switch>
          </div>
        </div>
      </Card>
    </div>
  );
};
