"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/default/ui/fluid-avatar";

export default function Particle() {
  return (
    <>
      <Avatar>
        <AvatarImage alt="" src="https://github.com/shadcn.png" />
        <AvatarFallback>LK</AvatarFallback>
      </Avatar>

      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="compact">
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-3">
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </AvatarGroup>

        <div
          className="flex w-fit items-center rounded-lg p-3"
          style={{
            backgroundImage:
              "repeating-conic-gradient(var(--muted-foreground) 0% 25%, transparent 0% 50%)",
            backgroundSize: "12px 12px",
            opacity: 0.999,
          }}
        >
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </div>
      </div>
    </>
  );
}
