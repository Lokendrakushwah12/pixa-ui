"use client";

import { CodeBlock } from "@/registry/default/ui/code-block";

const SAMPLE = `import { InputOTP } from "@/components/ui/input-otp";

export function Verify() {
  const [code, setCode] = useState("");
  return (
    <InputOTP
      maxLength={6}
      groups={[3, 3]}
      value={code}
      onChange={setCode}
    />
  );
}`;

export default function Particle() {
  return (
    <>
      <div className="w-full max-w-lg">
        <CodeBlock
          code={SAMPLE}
          filename="verify.tsx"
          highlightLines={[6, 7]}
          language="tsx"
          showLineNumbers
        />
      </div>
      <div className="w-full max-w-lg">
        <CodeBlock code={SAMPLE} language="tsx" maxLines={5} />
      </div>
    </>
  );
}
