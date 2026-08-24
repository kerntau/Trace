import React from "react";

export interface HeroProviderProps {
  children: React.ReactNode;
  navigate?: (path: string) => void;
}

export const HeroProvider: React.FC<HeroProviderProps> = ({ children }) => {
  return <>{children}</>;
};
