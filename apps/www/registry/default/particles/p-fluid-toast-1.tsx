"use client";

import { Button } from "@/registry/default/ui/button";
import { Toaster, useToast } from "@/registry/default/ui/fluid-toast";

function ToastButtons() {
  const { toast } = useToast();
  return (
    <>
      <Button
        onClick={() =>
          toast({ description: "Your changes are live.", title: "Saved" })
        }
        variant="secondary"
      >
        Default
      </Button>
      <Button
        onClick={() =>
          toast({
            description: "Build 412 is serving.",
            title: "Deployed",
            tone: "success",
          })
        }
        variant="secondary"
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast({
            action: { label: "Retry", onClick: () => {} },
            description: "The file exceeds 25MB.",
            title: "Upload failed",
            tone: "error",
          })
        }
        variant="secondary"
      >
        Error + action
      </Button>
      <Button
        onClick={() => toast({ duration: null, title: "Sticks around" })}
        variant="ghost"
      >
        No timeout
      </Button>
    </>
  );
}

export default function Particle() {
  return (
    <Toaster>
      <ToastButtons />
    </Toaster>
  );
}
