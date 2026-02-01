import { Button } from "@pixa/ui/components/button";

export function SiteCta() {
  return (
    <section>
      <div className="container flex w-full items-center justify-center gap-2 px-4 sm:px-6">
        <Button>Read Docs</Button>
        <Button variant="outline">Components</Button>
      </div>
    </section>
  );
}
