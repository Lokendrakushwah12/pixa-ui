import { GitHubLink } from "@pixa/ui/shared/github-link";
import { ModeSwitcher } from "@pixa/ui/shared/mode-switcher";
import Link from "next/link";

export function SiteHeader({
  mobileNav,
  children,
}: {
  mobileNav?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const gatewayOrigin = process.env.NEXT_PUBLIC_PIXA_URL || "";
  const gatewayHome = gatewayOrigin ? `${gatewayOrigin}/` : "/";
  const isExternal = !!gatewayOrigin;

  return (
    <header className="fixed top-0 z-40 w-full">
      <div className="-bottom-4 -z-10 pointer-events-none absolute top-0 right-0 left-0 bg-sidebar/0 backdrop-blur-lg [--tw-webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_50%)] [mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_50%)] [mask-mode:match-source] [mask-repeat:no-repeat] [mask-size:100%_100%] [webkit-mask-image:var(--tw-webkit-mask-image)]" />
      <div className="container relative flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6">
        {mobileNav}
        <div className="-mt-0.5 flex shrink-0 select-none items-center gap-1.5 font-heading text-2xl sm:text-[1.625em]">
          {isExternal ? (
            <a aria-label="Home" href={gatewayHome}>
              pixa <span className="text-muted-foreground/72">ui</span>
            </a>
          ) : (
            <Link aria-label="Home" href={gatewayHome}>
              pixa <span className="text-muted-foreground/72">ui</span>
            </Link>
          )}
        </div>
        <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {children}
          <GitHubLink />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
