"use client";

import type { Task } from "@/registry/default/ui/task-list";
import { TaskList } from "@/registry/default/ui/task-list";

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
  return (
    <div className="w-full max-w-sm">
      <TaskList tasks={steps} />
    </div>
  );
}
