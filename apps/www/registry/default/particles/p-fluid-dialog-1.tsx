"use client";

import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/fluid-dialog";

export default function Particle() {
  return (
    <>
      {(["sm", "lg", "xl"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button size="compact" variant="secondary">
              {size}
            </Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Spring enter and exit</DialogTitle>
              <DialogDescription>
                Exit runs one tier quicker than the entrance.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
