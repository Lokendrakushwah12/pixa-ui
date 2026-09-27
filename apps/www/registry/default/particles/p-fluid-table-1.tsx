"use client";

import { Badge } from "@/registry/default/ui/fluid-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/default/ui/fluid-table";

export default function Particle() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Origin</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["Button", "Fluid Functionalism"],
          ["Input OTP", "This repo"],
          ["Chart", "This repo"],
        ].map(([name, origin]) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{origin}</TableCell>
            <TableCell>
              <Badge color="green">Installed</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
