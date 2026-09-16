"use client";

import { useState } from "react";
import { Badge } from "@/registry/default/ui/badge";
import type { Column } from "@/registry/default/ui/crm-table";
import { CrmTable } from "@/registry/default/ui/crm-table";

const deals: Deal[] = [
  {
    company: "Northwind",
    id: "d1",
    owner: "Ada",
    stage: "Proposal",
    value: 42000,
  },
  {
    company: "Helios",
    id: "d2",
    owner: "Grace",
    stage: "Discovery",
    value: 18500,
  },
  {
    company: "Meridian",
    id: "d3",
    owner: "Ada",
    stage: "Closed won",
    value: 96000,
  },
  {
    company: "Quarry",
    id: "d4",
    owner: "Alan",
    stage: "Proposal",
    value: null,
  },
  {
    company: "Lumen",
    id: "d5",
    owner: "Grace",
    stage: "Discovery",
    value: 7300,
  },
];

interface Deal {
  id: string;
  company: string;
  owner: string;
  stage: string;
  value: number | null;
}

const columns: Column<Deal>[] = [
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
  const [selected, setSelected] = useState(new Set<string>(["d3"]));
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            className="h-9 w-56 rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter deals…"
            value={query}
          />
          <span className="text-[12px] text-muted-foreground">
            {selected.size} selected
          </span>
        </div>
        <CrmTable
          columns={columns}
          onSelectedChange={setSelected}
          query={query}
          rowId={(r) => r.id}
          rows={deals}
          selected={selected}
        />
      </div>
      <CrmTable
        columns={columns}
        rowId={(r) => r.id}
        rows={deals.slice(0, 3)}
      />
    </>
  );
}
