import React, { useState } from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  className = "",
  delay = 100
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const t = setTimeout(() => setIsVisible(true), delay);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-[100] px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-foreground text-background shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${placementClasses[placement]} ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
