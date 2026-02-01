"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import { Field, FieldDescription } from "@/registry/default/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/default/ui/fieldset";
import { Form } from "@/registry/default/ui/form";
import { Slider, SliderValue } from "@/registry/default/ui/slider";

export default function Particle() {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<number | readonly number[]>([25, 75]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const volumes = formData.getAll("volume");
    alert(`Volume: ${volumes.join(", ")}`);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Fieldset className="flex max-w-none flex-col items-stretch gap-3">
        <Field>
          <Slider
            disabled={loading}
            name="volume"
            onValueChange={setValue}
            value={value}
          >
            <div className="mb-2 flex items-center justify-between gap-1">
              <FieldsetLegend>Volume</FieldsetLegend>
              <SliderValue />
            </div>
          </Slider>
          <FieldDescription>Choose a value between 0 and 100</FieldDescription>
        </Field>
      </Fieldset>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </Form>
  );
}
