import React from "react";
import { GlobalContentData } from "@trace/config";
import { Card, CardHeader, CardBody, Chip } from "@trace/ui";
import { RiFlagFill, RiCalendarLine } from "react-icons/ri";

export interface MilestonePageProps {
  data: GlobalContentData;
}

export const MilestonePage: React.FC<MilestonePageProps> = ({ data }) => {
  return (
    <div className="max-w-[840px] mx-auto px-4 py-10 pt-24">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">人生里程碑</h1>
        <p className="text-xs text-default-400">成长路上的关键时刻与重要节点</p>
      </div>

      <div className="relative pl-6 md:pl-8 border-l-2 border-primary/20 space-y-8">
        {data.milestones.map((m) => (
          <div key={m.id} className="relative group">
            {/* Dot icon */}
            <div className="absolute -left-[31px] md:-left-[39px] top-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] shadow-md ring-4 ring-primary/20 group-hover:scale-110 transition">
              <RiFlagFill />
            </div>

            <Card className="border border-divider/60 bg-content1/80 backdrop-blur-sm p-3 rounded-3xl shadow-xs group-hover:border-primary/50 transition">
              <CardHeader className="flex items-center justify-between p-3 pb-2">
                <h3 className="text-base md:text-lg font-bold text-foreground">
                  {m.title}
                </h3>
                <span className="text-xs text-default-400 font-mono flex items-center gap-1">
                  <RiCalendarLine /> {m.date}
                </span>
              </CardHeader>

              <CardBody className="p-3 pt-0 space-y-3 text-left">
                {m.description && (
                  <p className="text-xs md:text-sm text-default-600 leading-relaxed whitespace-pre-wrap">
                    {m.description}
                  </p>
                )}

                {m.cover && (
                  <img
                    src={m.cover}
                    alt={m.title}
                    className="max-h-64 rounded-2xl object-cover border border-divider/60 w-full"
                  />
                )}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
