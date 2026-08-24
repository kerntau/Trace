import React from "react";
import { GlobalContentData } from "@trace/config";
import { formatDate } from "@trace/utils";
import { Card, CardHeader, CardBody, CardFooter, Chip, Button, Avatar } from "@trace/ui";
import { RiMapPin2Line, RiHeart3Line } from "react-icons/ri";

export interface RecordPageProps {
  data: GlobalContentData;
}

export const RecordPage: React.FC<RecordPageProps> = ({ data }) => {
  return (
    <div className="max-w-[720px] mx-auto px-4 py-10 pt-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">闪念说说</h1>
        <p className="text-xs text-default-400">记录生活与灵光乍现的瞬间</p>
      </div>

      <div className="space-y-6">
        {data.records.map((r) => (
          <Card
            key={r.id}
            className="border border-divider/60 bg-content1/80 backdrop-blur-sm p-2 rounded-3xl shadow-xs"
          >
            <CardHeader className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-2 text-xs text-default-400">
                {r.mood && <span className="text-lg">{r.mood}</span>}
                <span className="font-mono">{formatDate(r.createTime, "YYYY-MM-DD HH:mm")}</span>
              </div>
              {r.location && (
                <Chip size="sm" variant="flat" color="default" startContent={<RiMapPin2Line className="text-xs ml-1" />}>
                  {r.location}
                </Chip>
              )}
            </CardHeader>

            <CardBody className="px-4 py-2">
              <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                {r.content}
              </p>

              {r.images && r.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
                  {r.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Record attachment"
                      className="w-full h-32 object-cover rounded-2xl border border-divider/60"
                    />
                  ))}
                </div>
              )}
            </CardBody>

            <CardFooter className="px-4 pb-3 flex justify-end">
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<RiHeart3Line />}
                className="text-xs h-7 px-2.5 rounded-xl font-medium"
              >
                {r.likes || 0}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
