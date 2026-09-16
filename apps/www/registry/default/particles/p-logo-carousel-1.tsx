"use client";

import { Badge } from "@/registry/default/ui/badge";
import type { Column } from "@/registry/default/ui/crm-table";
import {
  LogoCarousel,
  placeholderLogos,
} from "@/registry/default/ui/logo-carousel";

interface Deal {
  id: string;
  company: string;
  owner: string;
  stage: string;
  value: number | null;
}

const _columns: Column<Deal>[] = [
  { accessor: (r) => r.company, header: "Company", id: "company" },
  { accessor: (r) => r.owner, header: "Owner", id: "owner" },
  {
    accessor: (r) => r.stage,
    cell: (r) => (
      <Badge color={r.stage === "Closed won" ? "green" : undefined}>
        {r.stage}
      </Badge>
    ),
    header: "Stage",
    id: "stage",
  },
  {
    accessor: (r) => r.value,
    align: "end",
    cell: (r) => (r.value === null ? "—" : `$${r.value.toLocaleString()}`),
    header: "Value",
    id: "value",
  },
];

export default function Particle() {
  return (
    <div className="w-full rounded-lg border border-border p-6">
      <LogoCarousel columns={4} logos={placeholderLogos} />
    </div>
  );
}
