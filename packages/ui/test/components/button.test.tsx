import { beforeEach, describe, expect, mock, test } from "bun:test";
import * as React from "react";

type UseRenderConfig = {
  defaultTagName: string;
  render?: (...args: unknown[]) => unknown;
  props: Record<string, unknown>;
};

const useRenderCalls: UseRenderConfig[] = [];
const mergePropsCalls: Array<
  [Record<string, unknown>, Record<string, unknown>]
> = [];

function useRenderMock(config: UseRenderConfig) {
  useRenderCalls.push(config);
  return null;
}

function mergePropsMock(
  defaults: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
) {
  mergePropsCalls.push([defaults, overrides]);
  return { ...defaults, ...overrides };
}

mock.module("@base-ui/react/use-render", () => ({
  useRender: useRenderMock,
}));

mock.module("@base-ui/react/merge-props", () => ({
  mergeProps: mergePropsMock,
}));

const { Button } = await import("../../src/components/button");

function lastUseRenderCall() {
  const lastCall = useRenderCalls[useRenderCalls.length - 1];
  if (!lastCall) {
    throw new Error("useRender was not called");
  }
  return lastCall;
}

function lastMergePropsCall() {
  const lastCall = mergePropsCalls[mergePropsCalls.length - 1];
  if (!lastCall) {
    throw new Error("mergeProps was not called");
  }
  return lastCall;
}

describe("Button", () => {
  beforeEach(() => {
    useRenderCalls.length = 0;
    mergePropsCalls.length = 0;
  });

  test("sets base attributes and defaults type to button", () => {
    Button({ children: "Default label" });

    const call = lastUseRenderCall();
    expect(call.defaultTagName).toBe("button");
    expect(call.props["data-slot"]).toBe("button");
    expect(call.props.type).toBe("button");
  });

  test("omits the default type when a custom render is provided", () => {
    const render = () => React.createElement("div");
    Button({ render, type: "submit" });

    const [defaults, overrides] = lastMergePropsCall();
    expect(defaults.type).toBeUndefined();
    expect(overrides.type).toBe("submit");

    const call = lastUseRenderCall();
    expect(call.render).toBe(render);
  });

  test("merges variants, sizes, and custom className", () => {
    Button({
      className: "custom-class",
      size: "lg",
      variant: "destructive",
    });

    const call = lastUseRenderCall();
    const className = call.props.className as string;
    expect(className).toContain("border-destructive");
    expect(className).toContain("h-10");
    expect(className).toContain("custom-class");
  });
});
