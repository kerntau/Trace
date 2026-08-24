import React, { HTMLAttributes } from "react";
import { Skeleton as HeroSkeleton } from "@heroui/react";
import { cn } from "@trace/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  width,
  height,
  style,
  ...props
}) => {
  const variants = {
    text: "rounded h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  };

  return (
    <HeroSkeleton
      className={cn(variants[variant], className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style
      }}
      {...(props as any)}
    />
  );
};

