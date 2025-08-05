"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Magnetic hook
function useMagnetic() {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      const maxDistance = 100;
      const strength = Math.max(0, 1 - distance / maxDistance);
      
      setX((e.clientX - centerX) * strength * 0.3);
      setY((e.clientY - centerY) * strength * 0.3);
    }
  };

  const handleMouseLeave = () => {
    setX(0);
    setY(0);
  };

  return { ref, handleMouseMove, handleMouseLeave, x, y };
}

// Button variants with all the special variants from the MDX file
const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 inset-shadow-[0_1px_rgb(255_255_255/0.5)]",
        destructive:
          "bg-destructive text-white shadow-xs border border-destructive/60 hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 dark:hover:bg-destructive/70",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Special variants from MDX file
        shine: "group relative overflow-hidden rounded-xl px-4 py-2 text-primary-invert duration-300 bg-primary/80 dark:hover:bg-primary",
        "animated-border": "group relative overflow-hidden rounded-xl px-4 py-2 text-primary-invert duration-300 bg-primary/80 dark:hover:bg-primary",
        "rotate-border": "group relative overflow-hidden rounded-xl px-4 py-2 text-primary-invert duration-300 bg-primary/80 dark:hover:bg-primary",
        "glitch-brightness": "group relative overflow-hidden rounded-xl px-4 py-2 text-primary-invert duration-300 bg-primary/80 dark:hover:bg-primary",
        magnetic: "group relative overflow-hidden rounded-xl px-4 py-2 text-primary-invert duration-300 bg-primary/80 dark:hover:bg-primary",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isMagnetic?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isMagnetic = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const buttonContent = (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {variant === "shine" && (
        <>
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 -top-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:top-[100%] transition-all duration-1000" />
        </>
      )}
      {variant === "animated-border" && (
        <>
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary to-primary bg-clip-border group-hover:border-primary transition-all duration-300" />
        </>
      )}
      {variant === "rotate-border" && (
        <>
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-clip-border group-hover:rotate-180 transition-all duration-500" />
        </>
      )}
      {variant === "glitch-brightness" && (
        <>
          <div className="relative overflow-hidden">
            <span className="invisible">{children}</span>
            <span className="group-hover:-translate-y-full absolute top-0 left-0 transition-transform duration-500 ease-in-out hover:duration-300">
              {children}
            </span>
            <span className="absolute top-0 left-0 translate-y-full transition-transform duration-500 ease-in-out hover:duration-300 group-hover:translate-y-0">
              {children}
            </span>
          </div>
          <div
            aria-hidden
            className="absolute inset-0 flex h-full w-full animate-pulse justify-center"
          >
            <div className="relative h-full w-8 bg-white/20 blur dark:bg-white/40" />
          </div>
        </>
      )}
      {(!variant || (variant !== "shine" && variant !== "animated-border" && variant !== "rotate-border" && variant !== "glitch-brightness")) && children}
    </Comp>
  );

  if (isMagnetic || variant === "magnetic") {
    return <Magnetic>{buttonContent}</Magnetic>;
  }

  return buttonContent;
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const { ref, handleMouseMove, handleMouseLeave, x, y } = useMagnetic();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 150,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}

export { Button, buttonVariants };
