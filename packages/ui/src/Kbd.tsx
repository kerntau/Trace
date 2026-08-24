import React from "react";
import { Kbd as HeroKbd } from "@heroui/react";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  keys?: string | string[];
}

export const Kbd: React.FC<KbdProps> = ({ children, className = "", keys, ...props }) => {
  return (
    <kbd
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-default-100/90 dark:bg-default-50/20 text-default-600 border border-divider/60 shadow-2xs ${className}`}
      {...props}
    >
      {keys && (
        <span className="opacity-80">
          {Array.isArray(keys) ? keys.join("+") : keys}
        </span>
      )}
      {children}
    </kbd>
  );
};
