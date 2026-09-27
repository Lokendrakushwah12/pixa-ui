"use client";

import { useState } from "react";
import { PaginationControl } from "@/registry/default/ui/fluid-pagination";

export default function Particle() {
  const [page, setPage] = useState(1);
  return (
    <>
      <PaginationControl onPageChange={setPage} page={page} total={24} />
      <PaginationControl onPageChange={() => {}} page={2} total={4} />
    </>
  );
}
