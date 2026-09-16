"use client";

import { type ReactNode } from "react";

import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";
import { Badge } from "../../components/fluid/badge";
import { Button } from "../../components/fluid/button";
import { TaskList, type Task } from "../../components/fluid/task-list";

type PlanStatus = "proposed" | "approved" | "running" | "done" | "rejected";

interface PlanCardProps {
  title: string;
  summary?: string;
  steps: Task[];
  status?: PlanStatus;
  onApprove?: () => void;
  onReject?: () => void;
  footer?: ReactNode;
  className?: string;
}

const statusBadge: Record<PlanStatus, { label: string; color?: Parameters<typeof Badge>[0]["color"] }> = {
  proposed: { label: "Proposed" },
  approved: { label: "Approved", color: "blue" },
  running: { label: "Running", color: "blue" },
  done: { label: "Done", color: "green" },
  rejected: { label: "Rejected", color: "red" },
};

function PlanCard({
  title,
  summary,
  steps,
  status = "proposed",
  onApprove,
  onReject,
  footer,
  className,
}: PlanCardProps) {
  const shape = useShape();
  const badge = statusBadge[status];
  const decidable = status === "proposed";

  return (
    <section
      data-slot="plan-card"
      aria-label={`Plan: ${title}`}
      className={cn("flex flex-col gap-3 border border-border p-4", shape.container, className)}
    >
      <header className="flex items-start gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-[14px] font-medium text-foreground">{title}</h3>
          {summary && <p className="text-[12px] text-muted-foreground">{summary}</p>}
        </div>
        <Badge color={badge.color} className="ml-auto shrink-0">
          {badge.label}
        </Badge>
      </header>

      <TaskList tasks={steps} />

      {footer ??
        (decidable && (onApprove || onReject) ? (
          <footer className="flex gap-2 pt-1">
            {onApprove && (
              <Button size="compact" variant="primary" onClick={onApprove}>
                Approve
              </Button>
            )}
            {onReject && (
              <Button size="compact" variant="ghost" onClick={onReject}>
                Reject
              </Button>
            )}
          </footer>
        ) : null)}
    </section>
  );
}

export { PlanCard };
export type { PlanCardProps, PlanStatus };
