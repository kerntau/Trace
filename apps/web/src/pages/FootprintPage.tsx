import React from "react";
import { GlobalContentData } from "@trace/config";
import { Card, CardHeader, CardBody, Chip } from "@trace/ui";
import { RiMapPin2Fill, RiCalendarLine } from "react-icons/ri";

export interface FootprintPageProps {
  data: GlobalContentData;
}

export const FootprintPage: React.FC<FootprintPageProps> = ({ data }) => {
  return (
    <div className="max-w-[960px] mx-auto px-4 py-10 pt-24">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">旅行足迹</h1>
        <p className="text-xs text-default-400">步履不停，丈量世界</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {data.footprints.map((fp) => (
          <Card
            key={fp.id}
            className="border border-divider/60 bg-content1/80 backdrop-blur-sm p-2 rounded-3xl shadow-xs hover:border-primary/50 transition"
          >
            <CardHeader className="flex items-center justify-between px-4 pt-3">
              <Chip
                startContent={<RiMapPin2Fill className="text-xs ml-1" />}
                variant="flat"
                color="primary"
                size="sm"
                className="font-bold text-xs"
              >
                {fp.title}
              </Chip>
              <span className="text-xs text-default-400 font-mono flex items-center gap-1">
                <RiCalendarLine /> {fp.date}
              </span>
            </CardHeader>
            <CardBody className="px-4 py-2 space-y-1 text-left">
              <div className="text-xs text-default-500 font-medium">{fp.location}</div>
              {fp.description && (
                <p className="text-xs text-default-600 line-clamp-2 leading-relaxed">
                  {fp.description}
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
