"use client";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from "@/registry/default/ui/fluid-alert";

export default function Particle() {
  return (
    <div className="flex w-full flex-col gap-2">
      {(["default", "info", "success", "warning", "danger"] as const).map(
        (tone) => (
          <Alert key={tone} tone={tone}>
            <AlertContent>
              <AlertTitle>
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </AlertTitle>
              <AlertDescription>
                A callout that reads as part of the page.
              </AlertDescription>
            </AlertContent>
          </Alert>
        ),
      )}
    </div>
  );
}
