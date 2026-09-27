"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/fluid-accordion";

export default function Particle() {
  return (
    <>
      <div className="w-full max-w-md">
        <Accordion collapsible defaultValue="a" type="single">
          <AccordionItem value="a">
            <AccordionTrigger>What is Fluid Functionalism?</AccordionTrigger>
            <AccordionContent>
              Every animation serves a functional purpose.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Why spring physics?</AccordionTrigger>
            <AccordionContent>
              Springs adapt when a gesture reverses mid-transition.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-full max-w-md">
        <Accordion defaultValue={["a", "b"]} type="multiple">
          <AccordionItem value="a">
            <AccordionTrigger>First</AccordionTrigger>
            <AccordionContent>Both can stay open.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Second</AccordionTrigger>
            <AccordionContent>Height animates either way.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
