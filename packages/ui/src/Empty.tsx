import React from "react";
import { cn } from "@trace/utils";
import { RiInboxLine } from "react-icons/ri";

export interface EmptyProps {
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  description = "暂无数据",
  icon,
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500", className)}>
      <div className="text-5xl mb-3 opacity-60">
        {icon || <RiInboxLine />}
      </div>
      <p className="text-sm font-normal mb-4">{description}</p>
      {children}
    </div>
  );
};
