import React, { useState } from "react";
import { Card, CardHeader, CardBody, Textarea, Input, Button, Chip } from "@trace/ui";
import { RiAddLine, RiDeleteBinLine, RiChatSmile2Line, RiMapPin2Line } from "react-icons/ri";

export interface RecordManageProps {
  records: any[];
  onRefresh: () => void;
}

export const RecordManage: React.FC<RecordManageProps> = ({ records, onRefresh }) => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("😊");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddRecord = async () => {
    if (!content.trim()) {
      alert("请输入说说内容");
      return;
    }
    setSaving(true);
    try {
      const newRecord = {
        id: Date.now(),
        content,
        mood,
        location,
        createTime: Date.now(),
        likes: 0,
        images: []
      };
      const updatedList = [newRecord, ...records];
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList)
      });
      const data = await res.json();
      if (data.success) {
        setContent("");
        setLocation("");
        onRefresh();
      } else {
        alert(data.message);
      }
    } catch (e: any) {
      alert("添加失败: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定要删除这条说说吗？")) return;
    const updatedList = records.filter((r) => r.id !== id);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedList)
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (e: any) {
      alert("删除失败: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">闪念说说管理</h1>
        <p className="text-xs text-default-400 mt-1">管理日常随笔与状态 (content/records/records.json)</p>
      </div>

      {/* New record form */}
      <Card className="border border-divider/60 bg-content1/80 p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-foreground">发布新动态</h2>
        <Textarea
          placeholder="此时此刻的想法..."
          value={content}
          onValueChange={setContent}
          minRows={3}
          variant="bordered"
          classNames={{ inputWrapper: "rounded-2xl" }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="px-3 py-2 rounded-xl border border-divider/60 bg-content2/40 text-xs focus:outline-none text-foreground font-medium"
            >
              <option value="😊">😊 开心</option>
              <option value="🥰">🥰 喜爱</option>
              <option value="🤔">🤔 思考</option>
              <option value="💻">💻 沉迷代码</option>
              <option value="😢">😢 emo</option>
            </select>

            <Input
              size="sm"
              placeholder="地理位置 (选填)"
              value={location}
              onValueChange={setLocation}
              startContent={<RiMapPin2Line className="text-default-400" />}
              variant="bordered"
              classNames={{ inputWrapper: "rounded-xl" }}
              className="w-full sm:w-56"
            />
          </div>

          <Button
            color="primary"
            variant="shadow"
            size="sm"
            startContent={<RiAddLine className="text-base" />}
            onClick={handleAddRecord}
            isLoading={saving}
            className="w-full sm:w-auto rounded-xl font-bold text-xs h-9 px-5 shadow-primary/20"
          >
            {saving ? "正在发布..." : "发布动态"}
          </Button>
        </div>
      </Card>

      {/* Record list */}
      <div className="space-y-3.5">
        {records.map((r) => (
          <Card
            key={r.id}
            className="border border-divider/60 bg-content1/80 p-5 rounded-3xl shadow-xs"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="text-xs text-default-400 flex items-center gap-2 font-mono">
                  <span className="text-base font-normal">{r.mood}</span>
                  <span>{new Date(Number(r.createTime) || Date.now()).toLocaleString()}</span>
                  {r.location && <Chip size="sm" variant="flat" color="default" className="text-[10px] h-5">{r.location}</Chip>}
                </div>
                <p className="text-xs md:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {r.content}
                </p>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onClick={() => handleDelete(r.id)}
                className="rounded-lg"
              >
                <RiDeleteBinLine className="text-base" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
