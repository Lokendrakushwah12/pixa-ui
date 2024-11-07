import React from "react";
import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  color?: "pink" | "blue" | "green" | "yellow" | "cyan";
};

const Badge: React.FC<BadgeProps> = ({ children, color = "blue" }) => {
  return (
    <div
      className={clsx("inline-block w-fit rounded-md", {
        "bg-pink-500/20 text-pink-500 dark:bg-pink-500/15 dark:text-pink-300":
          color === "pink",
        "bg-blue-500/20 text-blue-500 dark:bg-blue-500/15 dark:text-blue-300":
          color === "blue",
        "bg-green-500/20 text-green-500": color === "green",
        "bg-yellow-500/20 text-yellow-500": color === "yellow",
        "bg-cyan-500/20 text-cyan-500": color === "cyan",
      })}
    >
      {children}
    </div>
  );
};

export default Badge;
