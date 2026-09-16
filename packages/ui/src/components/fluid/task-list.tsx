"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "../../lib/utils";
import { spring } from "../../fluid/lib/springs";
import { useIcon } from "../../fluid/lib/icon-context";
import { Spinner } from "../../components/fluid/spinner";

type TaskState = "pending" | "running" | "done" | "failed" | "skipped";

interface Task {
  id: string;
  label: string;
  state: TaskState;
  detail?: string[];
}

function TaskStateIcon({ state }: { state: TaskState }) {
  const CheckIcon = useIcon("check");
  const XIcon = useIcon("x");
  const DotIcon = useIcon("dot");

  if (state === "running") return <Spinner size="compact" label={null} />;
  if (state === "done")
    return <CheckIcon className="size-3.5 text-green-600 dark:text-green-500" />;
  if (state === "failed") return <XIcon className="size-3.5 text-destructive" />;
  if (state === "skipped") return <DotIcon className="size-3.5 text-muted-foreground/50" />;
  return (
    <span
      aria-hidden
      className="size-2 rounded-full border border-muted-foreground/40"
    />
  );
}

const stateLabel: Record<TaskState, string> = {
  pending: "Pending",
  running: "Running",
  done: "Done",
  failed: "Failed",
  skipped: "Skipped",
};

function TaskList({
  tasks,
  className,
  children,
}: {
  tasks: Task[];
  className?: string;
  children?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <ol data-slot="task-list" className={cn("flex flex-col gap-1", className)}>
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            layout={!reduceMotion}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : spring.moderate}
            className="flex flex-col gap-1"
          >
            <div className="flex items-start gap-2 text-[13px]">
              <span className="flex size-4 shrink-0 items-center justify-center pt-0.5">
                <TaskStateIcon state={task.state} />
              </span>
              <span
                className={cn(
                  "min-w-0",
                  task.state === "done" && "text-muted-foreground",
                  task.state === "pending" && "text-muted-foreground/70",
                  task.state === "skipped" && "text-muted-foreground/60",
                  task.state === "failed" && "text-foreground"
                )}
              >
                {task.label}
                <span className="sr-only"> — {stateLabel[task.state]}</span>
              </span>
            </div>

            {task.detail && task.detail.length > 0 && (
              <ul className="ml-6 flex flex-col gap-0.5">
                {task.detail.map((line, i) => (
                  <li key={i} className="text-[12px] text-muted-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
      {children}
    </ol>
  );
}

export { TaskList, TaskStateIcon };
export type { Task, TaskState };
