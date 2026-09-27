"use client";

import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { Slot } from "../../fluid/shared/slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "../../lib/utils";

const Form = FormProvider;

interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);
const FormItemContext = createContext<{ id: string } | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name as string });

  if (!fieldContext) throw new Error("useFormField must be used within <FormField>");
  if (!itemContext) throw new Error("useFormField must be used within <FormItem>");

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("flex flex-col gap-1.5", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: ComponentPropsWithoutRef<"label">) {
  const { error, formItemId } = useFormField();
  return (
    <label
      htmlFor={formItemId}
      data-slot="form-label"
      className={cn(
        "text-[12px] font-medium",
        error ? "text-destructive" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function FormControl({ ...props }: ComponentPropsWithoutRef<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      id={formDescriptionId}
      data-slot="form-description"
      className={cn("text-[12px] text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : children;
  if (!body) return null;

  return (
    <p
      id={formMessageId}
      data-slot="form-message"
      className={cn("text-[12px] text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
