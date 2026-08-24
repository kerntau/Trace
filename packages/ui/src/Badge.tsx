import React, { HTMLAttributes } from "react";
import { Badge as HeroBadge } from "@heroui/react";
import { cn } from "@trace/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  size = "sm",
  children,
  ...props
}) => {
  let resolvedColor: "default" | "accent" | "success" | "warning" | "danger" = "accent";
  if (variant === "primary" || variant === "secondary") {
    resolvedColor = "accent";
  } else if (variant === "success") {
    resolvedColor = "success";
  } else if (variant === "warning") {
    resolvedColor = "warning";
  } else if (variant === "danger") {
    resolvedColor = "danger";
  } else if (variant === "neutral") {
    resolvedColor = "default";
  }

  return (
    <HeroBadge
      color={resolvedColor}
      size={size}
      className={cn("inline-flex items-center font-medium", className)}
      {...(props as any)}
    >
      {children}
    </HeroBadge>
  );
};

