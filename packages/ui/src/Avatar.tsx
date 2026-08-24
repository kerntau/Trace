import React from "react";
import {
  Avatar as HeroAvatar,
  AvatarImage,
  AvatarFallback,
} from "@heroui/react";
import { cn } from "@trace/utils";

export interface AvatarProps {
  src?: string;
  name?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  isBordered?: boolean;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "accent";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt,
  size = "md",
  radius = "full",
  isBordered = false,
  color = "accent",
  className,
}) => {
  let resolvedColor: "default" | "accent" | "success" | "warning" | "danger" = "accent";
  if (color === "primary" || color === "secondary" || color === "accent") {
    resolvedColor = "accent";
  } else if (color === "success") {
    resolvedColor = "success";
  } else if (color === "warning") {
    resolvedColor = "warning";
  } else if (color === "danger") {
    resolvedColor = "danger";
  } else if (color === "default") {
    resolvedColor = "default";
  }

  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <HeroAvatar
      color={resolvedColor}
      size={size}
      className={cn(
        radius && radiusClasses[radius],
        isBordered && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
    >
      {src && <AvatarImage src={src} alt={alt || name || "Avatar"} />}
      <AvatarFallback color={resolvedColor}>
        {name ? name.slice(0, 2).toUpperCase() : "U"}
      </AvatarFallback>
    </HeroAvatar>
  );
};

export const AvatarGroup: React.FC<{
  max?: number;
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("flex items-center -space-x-2", className)}>{children}</div>
);
