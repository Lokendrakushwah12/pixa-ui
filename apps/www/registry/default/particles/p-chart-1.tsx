"use client";

import type { ChartConfig } from "@/registry/default/ui/chart";
import {
  Bar,
  BarChart,
  ChartContainer,
  ChartDataTable,
  ChartGrid,
  ChartLegend,
  ChartPlot,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  chartMarks,
  Line,
  LineChart,
} from "@/registry/default/ui/chart";

const revenueConfig: ChartConfig = {
  direct: { label: "Direct", slot: 1 },
  partner: { label: "Partner", slot: 2 },
};

const latencyConfig: ChartConfig = {
  p50: { label: "p50", slot: 1 },
  p95: { label: "p95", slot: 2 },
  p99: { label: "p99", slot: 3 },
};

const revenue = [
  { direct: 420, month: "Jan", partner: 240 },
  { direct: 480, month: "Feb", partner: 280 },
  { direct: 390, month: "Mar", partner: 310 },
  { direct: 560, month: "Apr", partner: 290 },
  { direct: 610, month: "May", partner: 360 },
  { direct: 580, month: "Jun", partner: 410 },
];

const latency = [
  { day: "Mon", p50: 120, p95: 340, p99: 610 },
  { day: "Tue", p50: 132, p95: 360, p99: 580 },
  { day: "Wed", p50: 118, p95: 320, p99: 540 },
  { day: "Thu", p50: 145, p95: 410, p99: 720 },
  { day: "Fri", p50: 128, p95: 350, p99: 600 },
];

export default function Particle() {
  return (
    <>
      <ChartContainer config={revenueConfig}>
        <ChartPlot height={220}>
          <BarChart barGap={2} data={revenue}>
            <ChartGrid />
            <ChartXAxis dataKey="month" />
            <ChartYAxis />
            <ChartTooltip />
            <Bar dataKey="direct" fill="var(--chart-1)" {...chartMarks.bar} />
            <Bar dataKey="partner" fill="var(--chart-2)" {...chartMarks.bar} />
          </BarChart>
        </ChartPlot>
        <ChartLegend />
      </ChartContainer>

      <ChartContainer className="gap-3" config={latencyConfig}>
        <ChartPlot height={200}>
          <LineChart data={latency}>
            <ChartGrid />
            <ChartXAxis dataKey="day" />
            <ChartYAxis />
            <ChartTooltip />
            <Line dataKey="p50" stroke="var(--chart-1)" {...chartMarks.line} />
            <Line dataKey="p95" stroke="var(--chart-2)" {...chartMarks.line} />
            <Line dataKey="p99" stroke="var(--chart-3)" {...chartMarks.line} />
          </LineChart>
        </ChartPlot>
        <ChartLegend />
        <ChartDataTable
          caption="Request latency by day (ms)"
          data={latency}
          xKey="day"
        />
      </ChartContainer>
    </>
  );
}
