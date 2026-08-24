import React, { ButtonHTMLAttributes } from "react";
import { Button as HeroButton } from "@heroui/react";
import { cn } from "@trace/utils";
import { RiLoader4Line } from "react-icons/ri";

export type HeroButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: "solid" | "flat" | "bordered" | "light" | "shadow" | "ghost" | HeroButtonVariant;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  isIconOnly?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "solid",
  color = "default",
  size = "md",
  radius,
  isIconOnly = false,
  isLoading = false,
  fullWidth = false,
  startContent,
  endContent,
  disabled,
  as,
  href,
  target,
  rel,
  onClick,
  onPress,
  children,
  ...props
}) => {
  // 映射旧版 color/variant 到 HeroUI v3 标准语义变体
  let resolvedVariant: HeroButtonVariant = "secondary";

  if (
    variant === "primary" ||
    variant === "secondary" ||
    variant === "tertiary" ||
    variant === "outline" ||
    variant === "ghost" ||
    variant === "danger" ||
    variant === "danger-soft"
  ) {
    resolvedVariant = variant;
  } else if (variant === "bordered") {
    resolvedVariant = "outline";
  } else if (variant === "light") {
    resolvedVariant = "ghost";
  } else if (variant === "flat") {
    resolvedVariant = color === "primary" ? "secondary" : "tertiary";
  } else {
    // solid / shadow / default
    if (color === "primary") resolvedVariant = "primary";
    else if (color === "danger") resolvedVariant = "danger";
    else if (color === "secondary") resolvedVariant = "secondary";
    else resolvedVariant = "secondary";
  }

  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onPress?.();
  };

  if (as === "a" || href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none",
          radius && radiusClasses[radius],
          className
        )}
        {...(props as any)}
      >
        {startContent}
        {children}
        {endContent}
      </a>
    );
  }

  return (
    <HeroButton
      variant={resolvedVariant}
      size={size}
      isIconOnly={isIconOnly}
      fullWidth={fullWidth}
      isDisabled={disabled || isLoading}
      onClick={handleClick as any}
      className={cn(radius && radiusClasses[radius], className)}
      {...(props as any)}
    >
      {isLoading ? <RiLoader4Line className="animate-spin text-lg" /> : startContent}
      {children}
      {!isLoading && endContent}
    </HeroButton>
  );
};

