import { Button } from "@pixa/ui/components/button";
import Link from "next/link";

export function SiteCta() {
  return (
    <section>
      <div className="flex w-full items-start justify-start gap-2 py-4">
        <Button render={<Link href="/docs" />}>Read Docs</Button>
        <Button
          render={<Link href="/docs/components/accordion" />}
          variant="outline"
        >
          Components
        </Button>
      </div>
    </section>
  );
}
