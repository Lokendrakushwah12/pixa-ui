"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/registry/default/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/default/ui/fluid-form";
import { Textarea } from "@/registry/default/ui/fluid-textarea";

interface ContactForm {
  name: string;
  notes: string;
}

export default function Particle() {
  const [saved, setSaved] = useState<string | null>(null);
  const form = useForm<ContactForm>({ defaultValues: { name: "", notes: "" } });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((v) => setSaved(v.name))}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive"
                />
              </FormControl>
              <FormDescription>How they should be addressed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: "A name is required" }}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} autoResize maxRows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <Button size="compact" type="submit">
            Save
          </Button>
          {saved && (
            <span className="text-[12px] text-muted-foreground">
              Saved “{saved}”
            </span>
          )}
        </div>
      </form>
    </Form>
  );
}
