import React, { HTMLAttributes } from "react";
import {
  Card as HeroCard,
  CardHeader as HeroCardHeader,
  CardTitle as HeroCardTitle,
  CardDescription as HeroCardDescription,
  CardContent as HeroCardContent,
  CardFooter as HeroCardFooter,
} from "@heroui/react";
import { cn } from "@trace/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  isPressable?: boolean;
  onPress?: () => void;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  variant?: "default" | "secondary" | "tertiary" | "transparent";
}

export const Card: React.FC<CardProps> & {
  Header: typeof HeroCardHeader;
  Title: typeof HeroCardTitle;
  Description: typeof HeroCardDescription;
  Content: typeof HeroCardContent;
  Body: typeof HeroCardContent;
  Footer: typeof HeroCardFooter;
} = ({
  className,
  isPressable,
  onPress,
  as: Component = "div",
  onClick,
  variant = "default",
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    onPress?.();
  };

  if (Component !== "div") {
    return (
      <Component
        onClick={handleClick}
        className={cn(
          "rounded-3xl border border-border bg-surface text-foreground transition-all duration-300",
          isPressable && "cursor-pointer hover:shadow-lg hover:border-primary/50 active:scale-[0.99]",
          className
        )}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }

  return (
    <HeroCard
      variant={variant}
      onClick={handleClick as any}
      className={cn(
        isPressable && "cursor-pointer hover:shadow-lg hover:border-primary/50 active:scale-[0.99]",
        className
      )}
      {...(props as any)}
    >
      {children}
    </HeroCard>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroCardHeader className={className} {...(props as any)}>
    {children}
  </HeroCardHeader>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <HeroCardTitle className={className} {...(props as any)}>
    {children}
  </HeroCardTitle>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <HeroCardDescription className={className} {...(props as any)}>
    {children}
  </HeroCardDescription>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroCardContent className={className} {...(props as any)}>
    {children}
  </HeroCardContent>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroCardContent className={className} {...(props as any)}>
    {children}
  </HeroCardContent>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroCardFooter className={className} {...(props as any)}>
    {children}
  </HeroCardFooter>
);

Card.Header = CardHeader as any;
Card.Title = CardTitle as any;
Card.Description = CardDescription as any;
Card.Content = CardContent as any;
Card.Body = CardBody as any;
Card.Footer = CardFooter as any;


