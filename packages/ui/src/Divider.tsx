import React, { HTMLAttributes } from "react";
import { Separator } from "@heroui/react";
import { cn } from "@trace/utils";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export const Divider: React.FC<DividerProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => {
  return (
    <Separator
      orientation={orientation}
      className={cn("bg-border/60", className)}
      {...(props as any)}
    />
  );
};

