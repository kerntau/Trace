import React, { createContext, useContext, useState } from "react";
import { cn } from "@trace/utils";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";

const NavbarContext = createContext<{
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}>({ isMenuOpen: false, setIsMenuOpen: () => {} });

export interface NavbarProps {
  isBordered?: boolean;
  isMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  children: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBordered = true,
  isMenuOpen: controlledOpen,
  onMenuOpenChange,
  maxWidth = "xl",
  className,
  children
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMenuOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setIsMenuOpen = (open: boolean) => {
    setInternalOpen(open);
    onMenuOpenChange?.(open);
  };

  const maxWidths = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-[1200px]",
    full: "max-w-full"
  };

  return (
    <NavbarContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isBordered && "border-b border-divider/60",
          className
        )}
      >
        <div className={cn("mx-auto px-4 h-16 flex items-center justify-between", maxWidths[maxWidth])}>
          {children}
        </div>
      </header>
    </NavbarContext.Provider>
  );
};

export const NavbarBrand: React.FC<{
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ className, onClick, children }) => (
  <div className={cn("flex items-center gap-3 cursor-pointer", className)} onClick={onClick}>
    {children}
  </div>
);

export const NavbarContent: React.FC<{
  justify?: "start" | "center" | "end";
  className?: string;
  children: React.ReactNode;
}> = ({ justify = "start", className, children }) => {
  const justifies = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end"
  };
  return <div className={cn("flex items-center gap-2", justifies[justify], className)}>{children}</div>;
};

export const NavbarItem: React.FC<{
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ isActive, className, children }) => (
  <div className={cn("flex items-center", isActive && "font-semibold", className)}>
    {children}
  </div>
);

export const NavbarMenuToggle: React.FC<{
  className?: string;
  "aria-label"?: string;
}> = ({ className, "aria-label": ariaLabel }) => {
  const { isMenuOpen, setIsMenuOpen } = useContext(NavbarContext);
  return (
    <button
      type="button"
      aria-label={ariaLabel || "Toggle navigation menu"}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className={cn("p-2 rounded-xl text-default-600 hover:bg-default-100 transition", className)}
    >
      {isMenuOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
    </button>
  );
};

export const NavbarMenu: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const { isMenuOpen } = useContext(NavbarContext);
  if (!isMenuOpen) return null;

  return (
    <div
      className={cn(
        "fixed top-16 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-md z-40 p-6 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200 overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const NavbarMenuItem: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => <div className={cn("w-full", className)}>{children}</div>;
