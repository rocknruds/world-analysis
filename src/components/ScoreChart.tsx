"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { ScoreSnapshot } from "@/lib/scores";

interface ScoreChartProps {
  snapshots: ScoreSnapshot[];
}

export default function ScoreChart({ snapshots }: ScoreChartProps) {
  if (!snapshots.length) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 text-sm bg-[#111111] rounded-lg border border-[#1f2937]">
        No score history available yet
      </div>
    );
  }

  const data = snapshots.map((s) => ({
    date: s.date
      ? new Date(s.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "—",
    "PF Score": s.pfScore || null,
    Authority: s.authorityScore || null,
    Reach: s.reachScore || null,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111111",
            border: "1px solid #1f2937",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelStyle={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}
          itemStyle={{ fontSize: 12 }}
        />
        <Legend
          iconType="line"
          wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
        />
        <Line
          type="monotone"
          dataKey="PF Score"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="Authority"
          stroke="#60a5fa"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="Reach"
          stroke="#f97316"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
