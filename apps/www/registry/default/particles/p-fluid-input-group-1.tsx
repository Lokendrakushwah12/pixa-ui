"use client";

import { useState } from "react";
import {
  InputField,
  InputGroup,
} from "@/registry/default/ui/fluid-input-group";

export default function Particle() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputField
          index={0}
          label="Name"
          onChange={setName}
          placeholder="Ada Lovelace"
          value={name}
        />
        <InputField
          index={1}
          label="Email"
          onChange={setEmail}
          placeholder="ada@example.com"
          value={email}
        />
      </InputGroup>
    </div>
  );
}
