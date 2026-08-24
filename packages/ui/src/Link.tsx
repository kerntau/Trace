import React, { AnchorHTMLAttributes } from "react";
import { Link as HeroLink } from "@heroui/react";
import { cn } from "@trace/utils";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  color?: "foreground" | "primary" | "secondary" | "success" | "warning" | "danger";
  underline?: "none" | "hover" | "always";
  onPress?: () => void;
}

export const Link: React.FC<LinkProps> = ({
  color = "primary",
  underline = "none",
  className,
  children,
  onClick,
  onPress,
  ...props
}) => {
  const colorClasses = {
    foreground: "text-foreground hover:text-primary",
    primary: "text-primary hover:opacity-80",
    secondary: "text-secondary hover:opacity-80",
    success: "text-success hover:opacity-80",
    warning: "text-warning hover:opacity-80",
    danger: "text-danger hover:opacity-80"
  };

  const underlineClasses = {
    none: "no-underline",
    hover: "hover:underline",
    always: "underline"
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    onPress?.();
  };

  return (
    <HeroLink
      onClick={handleClick as any}
      className={cn(
        "inline-flex items-center gap-1 transition-colors cursor-pointer",
        colorClasses[color],
        underlineClasses[underline],
        className
      )}
      {...(props as any)}
    >
      {children}
    </HeroLink>
  );
};

