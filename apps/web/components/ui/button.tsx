import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "gold" | "outline" | "ghost" | "link" | "secondary";
type ButtonSize = "sm" | "default" | "lg" | "xl";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[#3A1F3D] hover:bg-[#4E2A52] shadow-md hover:shadow-lg hover:shadow-[rgba(58,31,61,0.15)]",
  gold:
    "bg-[#C8A96A] hover:bg-[#B89852] shadow-md hover:shadow-lg hover:shadow-[rgba(200,169,106,0.12)]",
  outline:
    "border border-[var(--border)] bg-[var(--surface)] hover:bg-[rgba(58,31,61,0.06)] hover:border-[#3A1F3D]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface)] hover:bg-[rgba(58,31,61,0.06)] hover:border-[#3A1F3D]",
  ghost:
    "hover:bg-[rgba(58,31,61,0.06)]",
  link:
    "underline-offset-4 hover:underline",
};

const variantInlineColor: Record<ButtonVariant, string | undefined> = {
  default: "#FFFFFF",
  gold: "#FFFFFF",
  outline: undefined,
  secondary: undefined,
  ghost: undefined,
  link: "#3A1F3D",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 rounded-lg text-sm",
  default: "h-11 px-6 rounded-xl text-sm",
  lg: "h-14 px-8 rounded-xl text-base",
  xl: "h-16 px-10 rounded-2xl text-lg",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const inlineColor = variantInlineColor[variant];

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A1F3D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={inlineColor ? { color: inlineColor, ...style } : style}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
