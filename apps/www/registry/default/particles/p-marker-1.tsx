"use client";

import { Marker } from "@/registry/default/ui/marker";

export default function Particle() {
  return (
    <>
      <p className="max-w-lg text-[13px] leading-relaxed">
        A <Marker>default</Marker> highlight, an{" "}
        <Marker tone="info">informational</Marker> one, a{" "}
        <Marker tone="success">success</Marker>, a{" "}
        <Marker tone="warning">warning</Marker>, and a{" "}
        <Marker tone="danger">danger</Marker>.
      </p>
      <p className="max-w-lg text-[13px]">
        The claim that matters is{" "}
        <Marker label="highlighted" tone="success">
          validated in both modes
        </Marker>
        .
      </p>
    </>
  );
}
