import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  disabled = false,
  onClick,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl select-none outline-none transition-all duration-200";
  const variantStyles = {
    primary:
      "bg-[var(--button)] text-background hover:bg-[var(--button-hover)] border border-[var(--border)]",
    secondary:
      "bg-[var(--button-secondary)] text-foreground hover:bg-[var(--button-secondary-hover)] border border-[var(--border)]",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], {
        "cursor-not-allowed opacity-50": disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
