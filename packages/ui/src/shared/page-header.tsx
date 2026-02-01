import { cn } from "@pixa/ui/lib/utils";

function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={className} {...props}>
      <div className="container flex flex-col items-start gap-2 px-0 pt-8 text-left md:pt-12 lg:pt-16 xl:gap-4">
        {children}
      </div>
    </section>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn("font-heading text-4xl lg:text-5xl", className)}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground lg:text-lg", className)}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderDescription, PageHeaderHeading };
