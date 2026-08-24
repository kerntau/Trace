import React, { HTMLAttributes } from "react";
import { Chip as HeroChip } from "@heroui/react";
import { cn } from "@trace/utils";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "solid" | "flat" | "bordered" | "shadow" | "primary" | "secondary" | "tertiary";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  className,
  variant = "flat",
  color = "default",
  size = "md",
  radius,
  startContent,
  endContent,
  children,
  ...props
}) => {
  // 转换 color
  let resolvedColor: "default" | "accent" | "success" | "warning" | "danger" = "default";
  if (color === "primary" || color === "secondary" || color === "accent") {
    resolvedColor = "accent";
  } else if (color === "success") {
    resolvedColor = "success";
  } else if (color === "warning") {
    resolvedColor = "warning";
  } else if (color === "danger") {
    resolvedColor = "danger";
  }

  // 转换 variant
  let resolvedVariant: "primary" | "secondary" | "tertiary" = "secondary";
  if (variant === "solid" || variant === "shadow" || variant === "primary") {
    resolvedVariant = "primary";
  } else if (variant === "tertiary") {
    resolvedVariant = "tertiary";
  } else {
    resolvedVariant = "secondary";
  }

  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full"
  };

  return (
    <HeroChip
      color={resolvedColor}
      variant={resolvedVariant}
      size={size}
      className={cn(radius && radiusClasses[radius], className)}
      {...(props as any)}
    >
      {startContent}
      {children}
      {endContent}
    </HeroChip>
  );
};

