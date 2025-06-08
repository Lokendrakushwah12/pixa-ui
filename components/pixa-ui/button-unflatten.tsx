"use client";
import React, { useState, CSSProperties } from "react";

interface ButtonUnflattenProps {
  title: string;
  icon?: boolean;
  loading?: boolean;
  borderRadius?: string;
  variant?: "default" | "primary" | "secondary" | "destructive";
  className?: string;
  style?: CSSProperties;
}

const ButtonUnflatten: React.FC<ButtonUnflattenProps> = ({
  title,
  icon = true,
  loading = false,
  borderRadius = "8px",
  variant = "default",
  className = "",
  style,
}) => {
  const [hovered, setHovered] = useState(false);

  const disabledStyles = loading
    ? "opacity-80 cursor-not-allowed"
    : "cursor-pointer group";

  const variantStyles = {
    default: "",
    primary: "bg-neutral-900 border-neutral-800 text-white",
    secondary: "bg-gray-100 border-gray-300 text-gray-800",
    destructive: "bg-red-600 border-red-700 text-white",
  };

  if (!variantStyles[variant]) {
    variant = "default";
  }
  const selectedVariant = variantStyles[variant];

  const handleMouseEnter = () => {
    if (!loading) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };

  return (
    <div
      className={`relative w-fit overflow-hidden border ${disabledStyles} ${selectedVariant} ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ borderRadius, ...style }}
    >
      <div
        className="flex items-center justify-center gap-1 border-t border-[#ffffff60] p-2"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        <div className="absolute left-1/2 top-0 h-2 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-75 blur-lg transition-all duration-300 group-hover:opacity-25"></div>
        <h3
          className="text-shadow transition-all"
          style={{
            // color: textColor,
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.15)",
          }}
        >
          {title}
        </h3>
        {loading ? (
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon-md text-token-text-secondary animate-spin text-center"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        ) : (
          <>
            {icon && (
              <div className="flex w-5 items-center justify-end overflow-hidden">
                <div
                  className={`h-5 w-5 ${
                    hovered
                      ? "translate-x-[100%] duration-300"
                      : "translate-x-[0%] duration-0"
                  } transition-all`}
                >
                  {/* SVG icon */}
                </div>
                <div
                  className={`h-5 w-5 ${
                    hovered
                      ? "translate-x-[100%] duration-300"
                      : "translate-x-[0%] duration-0"
                  } transition-all`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.42999 4L15.5 10.07L9.42999 16.14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 10.0699L15 10.0699"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`h-5 w-5 ${
                    hovered
                      ? "translate-x-[100%] duration-300"
                      : "translate-x-[0%] duration-0"
                  } transition-all`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.42999 4L15.5 10.07L9.42999 16.14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 10.0699L15 10.0699"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ButtonUnflatten;
