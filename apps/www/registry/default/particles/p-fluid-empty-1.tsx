"use client";

import { Button } from "@/registry/default/ui/button";
import {
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/fluid-empty";
import { Spinner } from "@/registry/default/ui/spinner";

export default function Particle() {
  return (
    <div className="w-full max-w-xs rounded-lg border border-border border-dashed">
      <Empty>
        <EmptyMedia>
          <Spinner label={null} />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Nothing matched that filter. Try a broader query.
        </EmptyDescription>
        <EmptyActions>
          <Button size="compact" variant="secondary">
            Clear filters
          </Button>
        </EmptyActions>
      </Empty>
    </div>
  );
}
