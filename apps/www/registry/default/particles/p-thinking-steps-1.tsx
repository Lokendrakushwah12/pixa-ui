"use client";

import {
  ThinkingStep,
  ThinkingSteps,
  ThinkingStepsContent,
  ThinkingStepsHeader,
} from "@/registry/default/ui/thinking-steps";

export default function Particle() {
  return (
    <div className="w-full max-w-md">
      <ThinkingSteps defaultOpen>
        <ThinkingStepsHeader>Researching the registry</ThinkingStepsHeader>
        <ThinkingStepsContent>
          <ThinkingStep
            description="73 items listed"
            label="Read the manifest"
            status="complete"
          />
          <ThinkingStep
            description="63 returned 401"
            label="Checked licensing"
            status="complete"
          />
          <ThinkingStep label="Installing components" status="active" />
          <ThinkingStep label="Verify in the browser" status="pending" />
        </ThinkingStepsContent>
      </ThinkingSteps>
    </div>
  );
}
