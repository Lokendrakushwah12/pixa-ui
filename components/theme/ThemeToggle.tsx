"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(theme === "light" ? "dark" : "light");
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={handleToggle}
      className="transform transition-transform duration-300 ease-in-out active:scale-50"
    >
      <div
        className={`transition-transform duration-500 ${
          isAnimating ? "rotate scale-50" : "scale-100"
        }`}
      >
        {theme === "light" ? (
          <Image src="/assets/svg/dark.svg" alt="moon" width={20} height={20} />
        ) : (
          <Image src="/assets/svg/light.svg" alt="sun" width={20} height={20} />
        )}
      </div>
    </button>
  );
};
