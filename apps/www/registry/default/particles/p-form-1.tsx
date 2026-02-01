"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Field, FieldError, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import { Input } from "@/registry/default/ui/input";

export default function Particle() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert(`Email: ${formData.get("email") || ""}`);
  };

  return (
    <Form className="max-w-64" onSubmit={onSubmit}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input
          disabled={loading}
          placeholder="you@example.com"
          required
          type="email"
        />
        <FieldError>Please enter a valid email.</FieldError>
      </Field>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
