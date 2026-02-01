"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Checkbox } from "@/registry/default/ui/checkbox";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";

export default function Particle() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const accepted = formData.get("terms");
    alert(`Terms: ${accepted}`);
  };
  return (
    <Form className="w-auto" onSubmit={onSubmit}>
      <Field name="terms">
        <FieldLabel>
          <Checkbox defaultChecked disabled={loading} value="yes" />
          Accept terms and conditions
        </FieldLabel>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
