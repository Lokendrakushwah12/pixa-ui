"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const items = [
  { label: "Select a framework", value: null },
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Astro", value: "astro" },
];

export default function Particle() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert(`Framework: ${formData.get("framework") || ""}`);
  };

  return (
    <Form className="max-w-64" onSubmit={onSubmit}>
      <Field>
        <FieldLabel>Framework</FieldLabel>
        <Select
          aria-label="Select framework"
          disabled={loading}
          items={items}
          name="framework"
          required
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {items.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
        <FieldDescription>Pick your favorite.</FieldDescription>
        <FieldError>Please select a value.</FieldError>
      </Field>

      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
