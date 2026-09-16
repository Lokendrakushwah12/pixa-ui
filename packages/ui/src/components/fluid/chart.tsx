"use client";

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "../../lib/utils";
import { useShape } from "../../fluid/lib/shape-context";
import { surfaceClasses } from "../../fluid/lib/surface-classes";
import { useSurface } from "../../fluid/lib/surface-context";

type ChartSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface ChartSeries {
  label: string;
  slot?: ChartSlot;
  color?: string;
}

type ChartConfig = Record<string, ChartSeries>;

interface ChartContextValue {
  config: ChartConfig;
  colorOf: (key: string) => string;
}

const ChartContext = createContext<ChartContextValue | null>(null);

function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("Chart parts must be used inside <ChartContainer>");
  return ctx;
}

const ALL_PAIRS_SLOT_CAP = 3;

interface ChartContainerProps extends ComponentPropsWithoutRef<"div"> {
  config: ChartConfig;
  children: ReactNode;
  allPairs?: boolean;
}

function ChartContainer({
  config,
  children,
  allPairs = false,
  className,
  ...props
}: ChartContainerProps) {
  const keys = useMemo(() => Object.keys(config), [config]);

  const colorOf = useMemo(() => {
    const fallback = new Map<string, ChartSlot>();
    keys.forEach((key, i) => {
      fallback.set(key, ((i % 8) + 1) as ChartSlot);
    });
    return (key: string) => {
      const entry = config[key];
      if (entry?.color) return entry.color;
      const slot = entry?.slot ?? fallback.get(key) ?? 1;
      return `var(--chart-${slot})`;
    };
  }, [config, keys]);

  if (process.env.NODE_ENV !== "production") {
    if (keys.length > 8) {
      console.warn(
        `[chart] ${keys.length} series: slots are never cycled. Fold the tail into "Other" or use small multiples.`
      );
    }
    if (allPairs && keys.length > ALL_PAIRS_SLOT_CAP) {
      console.warn(
        `[chart] allPairs with ${keys.length} series: only the first ${ALL_PAIRS_SLOT_CAP} slots validate when every pair is compared. Facet instead.`
      );
    }
  }

  const value = useMemo(() => ({ config, colorOf }), [config, colorOf]);

  return (
    <ChartContext.Provider value={value}>
      <div data-slot="chart" className={cn("flex w-full flex-col", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  );
}

function ChartPlot({
  children,
  height = 240,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { children: ReactNode; height?: number }) {
  return (
    <div
      data-slot="chart-plot"
      className={cn("w-full", className)}
      style={{ height }}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

function ChartGrid(props: ComponentPropsWithoutRef<typeof CartesianGrid>) {
  return (
    <CartesianGrid
      vertical={false}
      stroke="var(--chart-grid)"
      strokeDasharray="3 3"
      {...props}
    />
  );
}

const axisDefaults = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

function ChartXAxis(props: ComponentPropsWithoutRef<typeof XAxis>) {
  return <XAxis {...axisDefaults} tickMargin={8} {...props} />;
}

function ChartYAxis(props: ComponentPropsWithoutRef<typeof YAxis>) {
  return <YAxis {...axisDefaults} width={40} {...props} />;
}

interface TooltipPayloadEntry {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
}) {
  const { config, colorOf } = useChart();
  const shape = useShape();
  const substrate = useSurface();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "min-w-32 border border-border p-2 text-[12px]",
        surfaceClasses(Math.min(substrate + 3, 8)),
        shape.container
      )}
    >
      {label !== undefined && (
        <p className="mb-1 font-medium text-foreground">{label}</p>
      )}
      <div className="flex flex-col gap-0.5">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? entry.name ?? "");
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-sm"
                style={{ background: colorOf(key) }}
              />
              <span className="text-muted-foreground">
                {config[key]?.label ?? key}
              </span>
              <span className="ml-auto font-medium tabular-nums text-foreground">
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartTooltip(props: ComponentPropsWithoutRef<typeof Tooltip>) {
  return (
    <Tooltip
      cursor={{ stroke: "var(--chart-grid)", strokeWidth: 1 }}
      content={<ChartTooltipContent />}
      {...props}
    />
  );
}

function ChartLegend({ className }: { className?: string }) {
  const { config, colorOf } = useChart();
  const keys = Object.keys(config);
  if (keys.length < 2) return null;

  return (
    <ul
      data-slot="chart-legend"
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 pt-3", className)}
    >
      {keys.map((key) => (
        <li key={key} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-sm"
            style={{ background: colorOf(key) }}
          />
          {config[key].label}
        </li>
      ))}
    </ul>
  );
}

function ChartDataTable<T extends Record<string, unknown>>({
  data,
  xKey,
  caption,
  className,
}: {
  data: T[];
  xKey: keyof T & string;
  caption?: string;
  className?: string;
}) {
  const { config } = useChart();
  const keys = Object.keys(config);
  const id = useId();

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-[12px]" aria-describedby={id}>
        {caption && (
          <caption id={id} className="pb-2 text-left text-muted-foreground">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-1.5 pr-3 text-left font-medium">
              {xKey}
            </th>
            {keys.map((key) => (
              <th key={key} scope="col" className="py-1.5 pr-3 text-right font-medium">
                {config[key].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border/50">
              <th scope="row" className="py-1.5 pr-3 text-left font-normal text-muted-foreground">
                {String(row[xKey])}
              </th>
              {keys.map((key) => (
                <td key={key} className="py-1.5 pr-3 text-right tabular-nums">
                  {String(row[key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const chartMarks = {
  line: { strokeWidth: 2, dot: false, activeDot: { r: 4, strokeWidth: 2 } },
  bar: { radius: [4, 4, 0, 0] as [number, number, number, number] },
  gap: { stroke: "var(--background)", strokeWidth: 2 },
} as const;

export {
  ChartContainer,
  ChartPlot,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartDataTable,
  chartMarks,
  useChart,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
};
export type { ChartConfig, ChartSeries, ChartSlot };
