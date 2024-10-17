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
  const baseStyles = "px-4 py-2 rounded-lg outline-none transition-all duration-200";
  const variantStyles = {
    primary: "bg-white text-background hover:bg-neutral-200",
    secondary: "bg-neutral-900 text-white hover:bg-neutral-800",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], {
        "opacity-50 cursor-not-allowed": disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
