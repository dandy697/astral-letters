import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "premium" | "dark";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border transition-all duration-300",
          variant === "default" && "border-[var(--border)] bg-[var(--surface)] shadow-sm",
          variant === "glass" && "border-[var(--border)] bg-white/90 backdrop-blur-sm shadow-sm",
          variant === "premium" && "border-[var(--border)] bg-gradient-to-br from-white via-[#FBF7F2] to-[#F7F0E8] shadow-md",
          variant === "dark" && "border-[#3A1F3D]/20 bg-[#3A1F3D] shadow-lg",
          className
        )}
        style={variant === "dark" ? { color: "#FFFFFF", ...style } : style}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };

