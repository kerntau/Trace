import React from "react";
import {
  Switch as HeroSwitch,
  SwitchContent,
  SwitchControl,
  SwitchThumb,
} from "@heroui/react";
import { cn } from "@trace/utils";

export interface SwitchProps {
  isSelected?: boolean;
  defaultSelected?: boolean;
  onValueChange?: (isSelected: boolean) => void;
  onChange?: (isSelected: boolean) => void;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  isSelected,
  defaultSelected,
  onValueChange,
  onChange,
  size = "md",
  children,
  className,
  disabled,
  ...props
}) => {
  const handleChange = (val: boolean) => {
    onValueChange?.(val);
    onChange?.(val);
  };

  return (
    <HeroSwitch
      size={size}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      onChange={handleChange}
      isDisabled={disabled}
      className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}
      {...(props as any)}
    >
      <SwitchContent>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        {children && <span>{children}</span>}
      </SwitchContent>
    </HeroSwitch>
  );
};

