"use client";

import { useState } from "react";
import { PlanCard } from "@/registry/default/ui/plan-card";
import type { Task } from "@/registry/default/ui/task-list";

const steps: Task[] = [
  { id: "1", label: "Read the registry manifest", state: "done" },
  {
    detail: ["53 items resolved", "51 files written"],
    id: "2",
    label: "Install the component set",
    state: "done",
  },
  { id: "3", label: "Typecheck the project", state: "running" },
  { id: "4", label: "Verify in the browser", state: "pending" },
  { id: "5", label: "Publish the registry", state: "skipped" },
];

export default function Particle() {
  const [status, setStatus] = useState<"proposed" | "approved" | "rejected">(
    "proposed",
  );
  return (
    <>
      <PlanCard
        className="w-full max-w-sm"
        onApprove={() => setStatus("approved")}
        onReject={() => setStatus("rejected")}
        status={status}
        steps={steps.slice(0, 3)}
        summary="Install from the registry, then fill the gaps."
        title="Port the component set"
      />
      <PlanCard
        className="w-full max-w-sm"
        status="running"
        steps={steps.slice(0, 2)}
        title="Already approved"
      />
    </>
  );
}
