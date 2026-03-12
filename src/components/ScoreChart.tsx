"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Dot,
} from "recharts";
import type { ScoreHistoryPoint } from "@/lib/types";

interface ScoreChartProps {
  snapshots: ScoreHistoryPoint[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

// Custom tooltip — shows all three scores + annotation if present
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const annotation = payload[0]?.payload?.annotation;
  const date = payload[0]?.payload?.date;

  return (
    <div
      className="rounded-lg border border-[#1f2937] bg-[#0f0f0f] p-3 text-xs shadow-xl max-w-xs"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <p className="text-gray-400 mb-2 font-medium">
        {date
          ? new Date(date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : label}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="font-bold tabular-nums" style={{ color: entry.color }}>
              {entry.value ?? "—"}
            </span>
          </div>
        ))}
      </div>
      {annotation && (
        <p className="mt-2 pt-2 border-t border-[#1f2937] text-gray-500 leading-relaxed line-clamp-4">
          {annotation}
        </p>
      )}
    </div>
  );
}

// Dot that highlights annotated points (event-triggered snapshots)
function AnnotatedDot(props: any) {
  const { cx, cy, payload, stroke } = props;
  if (!payload?.annotation) return <Dot {...props} r={2} />;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={stroke} opacity={0.2} />
      <circle cx={cx} cy={cy} r={3} fill={stroke} />
    </g>
  );
}

export default function ScoreChart({ snapshots }: ScoreChartProps) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-600">
        No score history available yet.
      </div>
    );
  }

  // Single point — recharts needs at least 2 points to draw lines
  // Pad with a ghost point 30 days earlier so it renders
  const data =
    snapshots.length === 1
      ? [
          {
            ...snapshots[0],
            date: new Date(
              new Date(snapshots[0].date).getTime() - 30 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
            pfScore: snapshots[0].pfScore,
            authorityScore: snapshots[0].authorityScore,
            reachScore: snapshots[0].reachScore,
            annotation: null,
          },
          snapshots[0],
        ]
      : snapshots;

  // Determine which lines have any non-null data
  const hasAuthority = data.some((d) => d.authorityScore !== null);
  const hasReach = data.some((d) => d.reachScore !== null);

  // Compute Y-axis domain with padding
  const allValues = data.flatMap((d) =>
    [d.pfScore, d.authorityScore, d.reachScore].filter(
      (v): v is number => v !== null
    )
  );
  const minVal = Math.max(0, Math.floor(Math.min(...allValues) / 10) * 10 - 10);
  const maxVal = Math.min(100, Math.ceil(Math.max(...allValues) / 10) * 10 + 5);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={[minVal, maxVal]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            formatter={(value) => (
              <span style={{ color: "#9ca3af" }}>{value}</span>
            )}
          />

          {/* PF Score — primary line, always shown */}
          <Line
            type="monotone"
            dataKey="pfScore"
            name="PF Score"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={<AnnotatedDot stroke="#3b82f6" />}
            activeDot={{ r: 5, fill: "#3b82f6" }}
            connectNulls
          />

          {/* Authority Score — only if data exists */}
          {hasAuthority && (
            <Line
              type="monotone"
              dataKey="authorityScore"
              name="Authority"
              stroke="#60a5fa"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              activeDot={{ r: 4, fill: "#60a5fa" }}
              connectNulls
            />
          )}

          {/* Reach Score — only if data exists */}
          {hasReach && (
            <Line
              type="monotone"
              dataKey="reachScore"
              name="Reach"
              stroke="#f97316"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              activeDot={{ r: 4, fill: "#f97316" }}
              connectNulls
            />
          )}

          {/* Tier reference lines — subtle orientation markers */}
          <ReferenceLine y={80} stroke="#374151" strokeDasharray="2 4" />
          <ReferenceLine y={60} stroke="#374151" strokeDasharray="2 4" />
          <ReferenceLine y={40} stroke="#374151" strokeDasharray="2 4" />
          <ReferenceLine y={25} stroke="#374151" strokeDasharray="2 4" />
        </LineChart>
      </ResponsiveContainer>

      {/* Tier legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {[
          { label: "Tier 1", range: "80+", color: "#22c55e" },
          { label: "Tier 2", range: "60–79", color: "#84cc16" },
          { label: "Tier 3", range: "40–59", color: "#eab308" },
          { label: "Tier 4–5", range: "25–39", color: "#f97316" },
          { label: "Tier 6–7", range: "<25", color: "#ef4444" },
        ].map((t) => (
          <div key={t.label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            <span className="text-xs text-gray-600">
              {t.label}{" "}
              <span className="text-gray-700">({t.range})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
