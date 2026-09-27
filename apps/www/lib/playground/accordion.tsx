import type { Schema } from "@/lib/playground/schema";
import {
  AccordionContent,
  AccordionGroup,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/fluid-accordion";

const SECTIONS = [
  {
    body: "Orders leave the warehouse within one working day. Tracking arrives by email as soon as the parcel is scanned.",
    title: "Shipping",
    value: "shipping",
  },
  {
    body: "Send anything back within 30 days. The label is prepaid and the refund lands on the original card.",
    title: "Returns",
    value: "returns",
  },
  {
    body: "Two years against manufacturing defects, extended to five if you register the product.",
    title: "Warranty",
    value: "warranty",
  },
];

export const accordionSchema: Schema = {
  craft: [
    "The open panel animates its height from a measured value rather than a CSS transition on auto, so the motion is interruptible mid-flight and reverses cleanly.",
    "The hover highlight resolves the nearest item and spans the expanded section when highlight is 'item' — the header alone would detach the highlight from the content it belongs to.",
    "Hairline dividers drop next to the active row so the highlight fill reads as one shape rather than a band between two lines.",
    "The panel stays mounted while it animates out and only then unmounts, so exit motion is not cut off by React removing the node.",
  ],
  groups: [
    {
      controls: [
        {
          id: "expand",
          initial: "One or none",
          kind: "select",
          label: "Expand",
          options: ["One or none", "One only", "Any number"],
        },
        {
          id: "highlightExpanded",
          initial: true,
          kind: "toggle",
          label: "Highlight expanded",
        },
      ],
    },
  ],
  name: "fluid-accordion",
  propDocs: [
    'type: "single" | "multiple" (default "single"). One section at a time, or any number.',
    "collapsible: boolean (default true). Whether the open section can be closed again, leaving none open.",
    'highlight: "item" | "trigger" (default "item"). Whether the hover highlight spans the whole expanded section or just its header row.',
    "value / defaultValue / onValueChange: a string in single mode, an array in multiple.",
    "AccordionItem index: position in the group, used by the fluid hover to resolve the nearest row.",
  ],
  render: (config) => {
    const expand = String(config.expand);
    const highlight = config.highlightExpanded ? "item" : "trigger";
    const items = SECTIONS.map((section, i) => (
      <AccordionItem index={i} key={section.value} value={section.value}>
        <AccordionTrigger>{section.title}</AccordionTrigger>
        <AccordionContent>{section.body}</AccordionContent>
      </AccordionItem>
    ));
    // AccordionGroup's props are a union discriminated on `type`, so the two
    // modes have to be written out rather than computed into one element.
    return expand === "Any number" ? (
      <AccordionGroup
        className="w-full max-w-md"
        defaultValue={["shipping"]}
        highlight={highlight}
        type="multiple"
      >
        {items}
      </AccordionGroup>
    ) : (
      <AccordionGroup
        className="w-full max-w-md"
        collapsible={expand !== "One only"}
        defaultValue="shipping"
        highlight={highlight}
        type="single"
      >
        {items}
      </AccordionGroup>
    );
  },
  summary:
    "An accordion with measured height animation, fluid hover across rows, and dividers that yield to the highlight.",
  title: "Accordion",
};
