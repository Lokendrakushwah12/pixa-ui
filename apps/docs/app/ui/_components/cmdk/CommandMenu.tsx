"use client";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";




import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeft,
  Code,
  CommandIcon,
  DockIcon,
  Home,
  SearchIcon
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./CommandMenuPrimitives";
type ItemProps = {
  heading: string;
  group: {
    title: string;
    icon: React.ReactNode;
    slug: string;
    isNew?: boolean;
    ref: React.MutableRefObject<any>;
    shortcut?: string;
  }[];
};

type CommandMenuItemProps = {
  shortcut?: string;
  icon: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAction: () => void;
  ref: React.MutableRefObject<any>;
  children?: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof CommandItem>;

function CommandMenuItem({
  children,
  icon,
  shortcut,
  className,
  setIsOpen,
  ref,
  onAction,
  ...props
}: CommandMenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-selected"
        ) {
          const isSelected =
            itemRef.current?.getAttribute("data-selected") === "true";
          if (isSelected) {
            ref.current?.goToAndPlay(0, true);
          }
        }
      });
    });

    observer.observe(itemRef.current, {
      attributes: true,
      attributeFilter: ["data-selected"],
    });

    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!shortcut) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(false);
        onAction();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen, shortcut, onAction]);

  return (
    <CommandItem
      {...props}
      ref={itemRef}
      onMouseEnter={() => ref.current?.goToAndPlay(0, true)}
      className={cn("cursor-pointer", className)}
    >
      <div className="flex items-center gap-2">
        <div className="opacity-70">{icon}</div>
        {children}
      </div>
      {shortcut && (
        <div className="flex gap-1 ml-auto">
          <div className="flex h-6 w-6 uppercase items-center text-xs font-semibold justify-center rounded-md bg-neutral-200 dark:bg-[#141414] text-neutral-400">
            <CommandIcon size={12} />
          </div>
          <div className="flex h-6 w-6 uppercase items-center text-xs font-semibold justify-center rounded-md bg-neutral-200 dark:bg-[#141414] text-neutral-400">
            {shortcut}
          </div>
        </div>
      )}
    </CommandItem>
  );
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const homeRef = useRef<any>(null);
  const codeRef = useRef<any>(null);
  const componentRefs = useRef<{ [key: string]: any }>({});

  function getComponentRef(title: string) {
    if (!componentRefs.current[title]) {
      componentRefs.current[title] = { current: null };
    }

    return componentRefs.current[title];
  }

  const ITEMS: ItemProps[] = [
    {
      heading: "Suggestions",
      group: [
        {
          title: "Home",
          icon: (
            <Home />
          ),
          ref: homeRef,
          slug: "/",
          shortcut: "h",
        },
      ],
    },
    {
      heading: "Get Started",
      group: [
        {
          title: "Installation",
          icon: (
            <Code />
          ),
          ref: codeRef,
          slug: "/docs/setup",
          shortcut: "i",
        },
      ],
    },
    {
      heading: "Components",
      group: [
        {
          title: "Accordion",
          slug: "/ui/accordion",
          ref: getComponentRef("Accordion"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Animated Tabs",
          slug: "/ui/animated-tabs",
          ref: getComponentRef("Animated Tabs"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Badge",
          slug: "/ui/badge",
          ref: getComponentRef("Badge"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Button",
          slug: "/ui/button",
          ref: getComponentRef("Button"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Card",
          slug: "/ui/card",
          ref: getComponentRef("Card"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Checkbox",
          slug: "/ui/checkbox",
          ref: getComponentRef("Checkbox"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Dialog",
          slug: "/ui/dialog",
          ref: getComponentRef("Dialog"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Dropdown Menu",
          slug: "/ui/dropdown-menu",
          ref: getComponentRef("Dropdown Menu"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Input",
          slug: "/ui/input",
          ref: getComponentRef("Input"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Input OTP",
          slug: "/ui/input-otp",
          ref: getComponentRef("InputOTP"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Multi Step Modal",
          slug: "/ui/multi-step-modal",
          ref: getComponentRef("Multi Step Modal"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Navigation Menu",
          slug: "/ui/navigation-menu",
          ref: getComponentRef("Navigation Menu"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Spinner",
          slug: "/ui/spinner",
          ref: getComponentRef("Spinner"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Switch",
          slug: "/ui/switch",
          ref: getComponentRef("Switch"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Text",
          slug: "/ui/text",
          ref: getComponentRef("Text"),
          icon: (
            <DockIcon />
          ),
        },
        {
          title: "Tooltip",
          slug: "/ui/tooltip",
          ref: getComponentRef("Tooltip"),
          icon: (
            <DockIcon />
          ),
        },
      ],
    },
  ];

  const isApp = pathname === "/" || pathname.startsWith("/updates");
  const isHomePage = pathname === "/";
  const uiPage = pathname.startsWith("/ui");

  const category = isApp ? "App" : "Docs";

  let currentPage = "";
  let subCategory = "";

  if (uiPage) {
    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts.length >= 2) {
      const isComponentPage = ITEMS.some(
        (item) =>
          item.heading === "Components" &&
          item.group.some((group) => group.slug === pathname),
      );

      if (isComponentPage) {
        subCategory = "Components";
        currentPage = pathParts[1].replace(/-/g, " ");
      }

      if (pathParts[1] === "installation") {
        subCategory = "Installation";
        currentPage = pathParts[2] ? pathParts[2].replace(/-/g, " ") : "";
      }

      if (!isComponentPage && pathParts[1] !== "installation") {
        currentPage = pathParts[1].replace(/-/g, " ");
      }
    }
  }

  if (isHomePage) {
    currentPage = "Home";
  }

  if (!uiPage && !isHomePage) {
    currentPage = pathname.split("/")[1];
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "group relative min-w-[120px]  sm:min-w-xs flex items-center cursor-pointer justify-between gap-4 pl-2.5 pr-2 py-1.5 border rounded-lg text-[13px] leading-none border-border/60 dark:border-border/50",
          "bg-background ease-linear duration-150 hover:bg-main-foreground/40 outline-none dark:hover:bg-main-foreground/20 dark:hover:border-white/10 focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -top-[0.031em] h-px w-1/2 max-w-[1000px] -translate-x-1/4 -translate-y-1/2 bg-gradient-to-l from-transparent via-white/18 via-30% to-transparent"
        />
        <span className="flex items-center gap-2 text-sm font-[460] text-neutral-500">
          <SearchIcon size={14} />
          Search...
        </span>
        <CommandMenuIcon />
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-1.5 pt-3 pl-4">
          <div className="bg-neutral-200 dark:bg-neutral-900 px-2 h-6 w-fit flex items-center justify-center rounded-md">
            <span className="text-[13px] font-[460] text-foreground capitalize">
              {category}
            </span>
          </div>
          {subCategory && (
            <div className="bg-neutral-200 dark:bg-neutral-900 px-2 h-6 w-fit flex items-center justify-center rounded-md">
              <span className="text-[13px] font-[460] text-foreground capitalize">
                {subCategory}
              </span>
            </div>
          )}
          {currentPage && (
            <div className="bg-neutral-200 dark:bg-neutral-900 px-2 h-6 w-fit flex items-center justify-center rounded-md">
              <span
                className={cn(
                  "text-[13px] font-[460] text-foreground",
                  currentPage === "cli" ? "uppercase" : "capitalize",
                )}
              >
                {currentPage}
              </span>
            </div>
          )}
        </div>
        <CommandInput placeholder="What do you need?" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <div className="space-y-1.5 pb-1.5 pt-1">
            {ITEMS.map(({ heading, group }) => (
              <CommandGroup key={heading} heading={heading}>
                {group.map(({ title, slug, icon, shortcut, ref }) => (
                  <CommandMenuItem
                    key={title}
                    icon={icon}
                    setIsOpen={setIsOpen}
                    onSelect={() => {
                      router.push(slug);
                      setIsOpen(false);
                    }}
                    ref={ref}
                    onAction={() => router.push(slug)}
                    shortcut={shortcut}
                  >
                    {title}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            ))}
          </div>
        </CommandList>
        <div className="flex items-center justify-between border-t border-border bg-background p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md text-neutral-500 bg-neutral-200 dark:bg-[#141414]">
                  <ArrowUpIcon size={16} />
                </div>
                <div className="p-1 rounded-md text-neutral-500 bg-neutral-200 dark:bg-[#141414]">
                  <ArrowDownIcon size={16} />
                </div>
              </div>
              <span className="text-sm">Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-neutral-200 dark:bg-[#141414]">
                <ChevronLeft className="text-neutral-500" />
              </div>
              <span className="text-sm">Select</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Close</span>
            <div className="p-1 text-xs rounded-md bg-neutral-200 dark:bg-[#141414]">
              <span className="text-neutral-500 font-medium">ESC</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}

function CommandMenuIcon() {
  return (
    <span
      className={cn(
        "text-neutral-500 border bg-white dark:bg-black border-border/60 ease-linear duration-150 group-hover:border-border",
        "px-1 py-1 rounded-sm text-[10px] flex items-center gap-0.5",
      )}
    >
      <CommandIcon size={10} /> K
    </span>
  );
}
