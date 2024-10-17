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
    "px-4 py-2 rounded-lg outline-none transition-all duration-200";
  const variantStyles = {
    primary:
      "bg-neutral-900 dark:bg-foreground dark:text-background text-foreground dark:hover:bg-neutral-200 hover:bg-neutral-800",
    secondary: "dark:bg-neutral-900 bg-neutral-100 hover:bg-neutral-200 dark:text-white dark:hover:bg-neutral-800",
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
