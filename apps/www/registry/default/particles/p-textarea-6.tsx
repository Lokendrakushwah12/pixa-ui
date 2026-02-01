"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import { Textarea } from "@/registry/default/ui/textarea";

export default function Particle() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert(`Message: ${formData.get("message") || ""}`);
  };

  return (
    <Form className="max-w-64" onSubmit={onSubmit}>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea
          disabled={loading}
          name="message"
          placeholder="Type your message here"
          required
        />
        <FieldError>This field is required.</FieldError>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
