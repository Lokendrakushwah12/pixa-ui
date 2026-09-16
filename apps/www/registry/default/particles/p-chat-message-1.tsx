"use client";

import { ChatMessage } from "@/registry/default/ui/chat-message";

export default function Particle() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ChatMessage from="user">
        Why is every other input box so stiff?
      </ChatMessage>
      <ChatMessage from="assistant">
        Because nothing about them moves with you.
      </ChatMessage>
    </div>
  );
}
