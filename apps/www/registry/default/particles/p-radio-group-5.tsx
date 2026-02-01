"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Field, FieldItem, FieldLabel } from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Form } from "@/registry/default/ui/form";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";

export default function Particle() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert(`Selected: ${formData.get("frameworks")}`);
  };

  return (
    <Form className="max-w-[160px]" onSubmit={onSubmit}>
      <Field
        className="gap-4"
        name="frameworks"
        render={(props) => <Fieldset {...props} />}
      >
        <FieldsetLegend className="font-medium text-sm">
          Frameworks
        </FieldsetLegend>
        <RadioGroup defaultValue="next">
          <FieldItem>
            <FieldLabel>
              <Radio disabled={loading} value="next" /> Next.js
            </FieldLabel>
          </FieldItem>
          <FieldItem>
            <FieldLabel>
              <Radio disabled={loading} value="vite" /> Vite
            </FieldLabel>
          </FieldItem>
          <FieldItem>
            <FieldLabel>
              <Radio disabled={loading} value="astro" /> Astro
            </FieldLabel>
          </FieldItem>
        </RadioGroup>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
