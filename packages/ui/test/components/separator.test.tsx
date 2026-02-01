import { beforeEach, describe, expect, mock, test } from "bun:test";

type SeparatorRenderCall = {
  className?: string;
  "data-slot"?: string;
  orientation?: "horizontal" | "vertical";
  [key: string]: unknown;
};

const separatorRenderCalls: SeparatorRenderCall[] = [];
const cnCalls: string[][] = [];

function mockSeparatorPrimitive(props: SeparatorRenderCall) {
  separatorRenderCalls.push(props);
  return null;
}

const SeparatorPrimitiveMock = Object.assign(mockSeparatorPrimitive, {
  Props: {} as Record<string, unknown>,
});

function cnMock(...inputs: string[]) {
  cnCalls.push(inputs);
  return inputs.filter(Boolean).join(" ");
}

mock.module("@base-ui/react/separator", () => ({
  Separator: SeparatorPrimitiveMock,
}));

mock.module("@pixa/ui/lib/utils", () => ({
  cn: cnMock,
}));

const { Separator: SeparatorComponent } = await import(
  "../../src/components/separator"
);

// Mock the Separator component to track render calls
function Separator(props: Parameters<typeof SeparatorComponent>[0]) {
  const element = SeparatorComponent(props);
  (element.type as (props: unknown) => unknown)(element.props);
}

function lastSeparatorCall() {
  const lastCall = separatorRenderCalls[separatorRenderCalls.length - 1];
  if (!lastCall) {
    throw new Error("Separator was not called");
  }
  return lastCall;
}

describe("Separator", () => {
  beforeEach(() => {
    separatorRenderCalls.length = 0;
    cnCalls.length = 0;
  });

  test("sets base attributes and defaults orientation to horizontal", () => {
    Separator({});

    const call = lastSeparatorCall();
    expect(call["data-slot"]).toBe("separator");
    expect(call.orientation).toBe("horizontal");
  });

  test("applies horizontal orientation styles by default", () => {
    Separator({});

    const call = lastSeparatorCall();
    const className = call.className as string;
    expect(className).toContain("shrink-0");
    expect(className).toContain("bg-border");
    expect(className).toContain("data-[orientation=horizontal]:h-px");
    expect(className).toContain("data-[orientation=horizontal]:w-full");
  });

  test("accepts vertical orientation", () => {
    Separator({ orientation: "vertical" });

    const call = lastSeparatorCall();
    expect(call.orientation).toBe("vertical");
  });

  test("applies vertical orientation styles", () => {
    Separator({ orientation: "vertical" });

    const call = lastSeparatorCall();
    const className = call.className as string;
    expect(className).toContain("data-[orientation=vertical]:w-px");
  });

  test("merges custom className with default styles", () => {
    Separator({ className: "custom-separator-class" });

    const call = lastSeparatorCall();
    const className = call.className as string;
    expect(className).toContain("shrink-0");
    expect(className).toContain("bg-border");
    expect(className).toContain("custom-separator-class");
  });

  test("passes through additional props", () => {
    Separator({ "aria-label": "Custom divider" });

    const call = lastSeparatorCall();
    expect((call as Record<string, unknown>)["aria-label"]).toBe(
      "Custom divider",
    );
  });
});
