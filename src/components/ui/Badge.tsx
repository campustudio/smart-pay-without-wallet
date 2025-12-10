import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
  size?: "sm" | "md";
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
}) => {
  const variants = {
    success: "bg-success-100 text-success-700 border-success-200",
    warning: "bg-warning-100 text-warning-700 border-warning-200",
    danger: "bg-danger-100 text-danger-700 border-danger-200",
    info: "bg-primary-100 text-primary-700 border-primary-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
};
