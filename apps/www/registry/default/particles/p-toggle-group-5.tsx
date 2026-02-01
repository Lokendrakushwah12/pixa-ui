import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import {
  Toggle,
  ToggleGroup,
  ToggleGroupSeparator,
} from "@/registry/default/ui/toggle-group";

export default function Particle() {
  return (
    <ToggleGroup
      defaultValue={["bold"]}
      orientation="vertical"
      variant="outline"
    >
      <Toggle aria-label="Toggle bold" value="bold">
        <BoldIcon />
      </Toggle>
      <ToggleGroupSeparator orientation="horizontal" />
      <Toggle aria-label="Toggle italic" value="italic">
        <ItalicIcon />
      </Toggle>
      <ToggleGroupSeparator orientation="horizontal" />
      <Toggle aria-label="Toggle underline" value="underline">
        <UnderlineIcon />
      </Toggle>
    </ToggleGroup>
  );
}
