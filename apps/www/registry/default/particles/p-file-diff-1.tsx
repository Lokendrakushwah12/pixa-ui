"use client";

import { FileDiff } from "@/registry/default/ui/file-diff";

const NEW_CODE = `export function greet(name: string): string {
  const message = \`hi \${name}\`;
  console.log(message);
  return message;
}`;

const OLD_CODE = `export function greet(name) {
  console.log("hi " + name);
  return null;
}`;

export default function Particle() {
  return (
    <>
      <div className="w-full max-w-lg">
        <FileDiff filename="greet.ts" newText={NEW_CODE} oldText={OLD_CODE} />
      </div>
      <div className="w-full max-w-lg">
        <FileDiff
          context={1}
          filename="greet.ts"
          newText={NEW_CODE}
          oldText={OLD_CODE}
        />
      </div>
    </>
  );
}
