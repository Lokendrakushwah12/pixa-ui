"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Checkbox } from "@/registry/default/ui/checkbox";
import { CheckboxGroup } from "@/registry/default/ui/checkbox-group";
import { Field, FieldItem, FieldLabel } from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Form } from "@/registry/default/ui/form";

export default function Particle() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const frameworks = formData.getAll("frameworks") as string[];
    alert(`Selected: ${frameworks.join(", ") || "none"}`);
  };

  return (
    <Form className="max-w-[160px]" onSubmit={onSubmit}>
      <Field
        className="gap-4"
        name="frameworks"
        render={(props) => <Fieldset {...props} />}
      >
        <FieldsetLegend>Frameworks</FieldsetLegend>
        <CheckboxGroup defaultValue={["next"]} disabled={loading}>
          <FieldItem>
            <FieldLabel>
              <Checkbox value="next" />
              Next.js
            </FieldLabel>
          </FieldItem>
          <FieldItem>
            <FieldLabel>
              <Checkbox value="vite" />
              Vite
            </FieldLabel>
          </FieldItem>
          <FieldItem>
            <FieldLabel>
              <Checkbox value="astro" />
              Astro
            </FieldLabel>
          </FieldItem>
        </CheckboxGroup>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
