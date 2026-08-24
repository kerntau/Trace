import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import {
  Input as HeroInput,
  TextArea as HeroTextArea,
} from "@heroui/react";
import { cn } from "@trace/utils";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  label?: string;
  variant?: "flat" | "bordered" | "underlined" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  classNames?: {
    inputWrapper?: string;
    input?: string;
    label?: string;
  };
  onValueChange?: (value: string) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  variant = "secondary",
  size = "md",
  startContent,
  endContent,
  classNames,
  className,
  onValueChange,
  onChange,
  value,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const resolvedVariant = (variant === "primary" || variant === "bordered") ? "primary" : "secondary";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <label className={cn("text-xs font-semibold text-foreground/80", classNames?.label)}>
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2",
          classNames?.inputWrapper
        )}
      >
        {startContent}
        <HeroInput
          value={value}
          variant={resolvedVariant}
          onChange={handleChange as any}
          className={cn("w-full", classNames?.input)}
          {...(props as any)}
        />
        {endContent}
      </div>
    </div>
  );
};

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  variant?: "flat" | "bordered" | "primary" | "secondary";
  minRows?: number;
  classNames?: {
    inputWrapper?: string;
    input?: string;
    label?: string;
  };
  onValueChange?: (value: string) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  variant = "secondary",
  minRows = 3,
  classNames,
  className,
  onValueChange,
  onChange,
  value,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const resolvedVariant = (variant === "primary" || variant === "bordered") ? "primary" : "secondary";

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <label className={cn("text-xs font-semibold text-foreground/80", classNames?.label)}>
          {label}
        </label>
      )}
      <div className={cn("w-full", classNames?.inputWrapper)}>
        <HeroTextArea
          rows={minRows}
          value={value}
          variant={resolvedVariant}
          onChange={handleChange as any}
          className={cn("w-full", classNames?.input)}
          {...(props as any)}
        />
      </div>
    </div>
  );
};

