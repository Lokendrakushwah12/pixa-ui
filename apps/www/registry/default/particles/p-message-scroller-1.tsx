"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { ChatMessage } from "@/registry/default/ui/chat-message";
import { MessageScroller } from "@/registry/default/ui/message-scroller";

export default function Particle() {
  const [messages, setMessages] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      from: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      id: `m${i}`,
      text: i % 2 === 0 ? `Message ${i + 1}` : `Reply ${i + 1}`,
    })),
  );
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <MessageScroller
        className="h-56 rounded-lg border border-border p-3"
        dep={messages.length}
      >
        {messages.map((m) => (
          <ChatMessage from={m.from} key={m.id}>
            {m.text}
          </ChatMessage>
        ))}
      </MessageScroller>
      <Button
        onClick={() =>
          setMessages((prev) => [
            ...prev,
            {
              from:
                prev.length % 2 === 0
                  ? ("user" as const)
                  : ("assistant" as const),
              id: `m${prev.length}`,
              text:
                prev.length % 2 === 0
                  ? `Message ${prev.length + 1}`
                  : `Reply ${prev.length + 1}`,
            },
          ])
        }
        size="compact"
        variant="secondary"
      >
        Append message
      </Button>
    </div>
  );
}
