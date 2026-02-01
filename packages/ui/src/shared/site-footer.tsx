import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative py-6 text-muted-foreground">
      <div className="container flex w-full items-center justify-center gap-2 px-4 sm:px-6">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link className="font-heading text-foreground text-lg" href="/">
            pixa <span className="text-muted-foreground/72">ui</span>
          </Link>{" "}
          – Build faster with beautifully crafted components.
        </p>
      </div>
    </footer>
  );
}
