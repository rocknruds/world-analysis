"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Actor } from "@/lib/types";
import { actorTypeBadgeColor, pfScoreColor } from "./ActorCard";
import ScoreDelta from "./ScoreDelta";

interface ActorTableProps {
  actors: Actor[];
  snapshotDeltaMap: Record<string, number>;
}

type SortKey = "pfScore" | "authorityScore" | "reachScore" | "name";

function ActorTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    State: "border-[#1d4ed8]/50 bg-[#1d4ed8]/15",
    "Non-State": "border-[#92400e]/50 bg-[#92400e]/15",
    Hybrid: "border-[#6d28d9]/50 bg-[#6d28d9]/15",
    IGO: "border-[#065f46]/50 bg-[#065f46]/15",
  };
  const border = styles[type] ?? "border-[#1f2937] bg-[#1f2937]";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border ${border} font-medium`}
      style={{ color: actorTypeBadgeColor(type) }}
    >
      {type || "—"}
    </span>
  );
}

function SortHeader({
  label,
  field,
  sortBy,
  sortDir,
  onClick,
}: {
  label: string;
  field: SortKey;
  sortBy: SortKey;
  sortDir: "asc" | "desc";
  onClick: (f: SortKey) => void;
}) {
  const active = sortBy === field;
  return (
    <th
      className={`pb-3 pr-4 cursor-pointer select-none whitespace-nowrap transition-colors ${
        active ? "text-white" : "text-gray-500 hover:text-gray-300"
      }`}
      onClick={() => onClick(field)}
    >
      {label}{" "}
      {active ? (
        <span className="text-[#3b82f6]">{sortDir === "asc" ? "↑" : "↓"}</span>
      ) : (
        <span className="text-gray-700">↕</span>
      )}
    </th>
  );
}

export default function ActorTable({ actors, snapshotDeltaMap }: ActorTableProps) {
  const [typeFilter, setTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("pfScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const actorTypes = useMemo(
    () => [...new Set(actors.map((a) => a.actorType).filter(Boolean))].sort(),
    [actors]
  );
  const regions = useMemo(
    () => [...new Set(actors.map((a) => a.region).filter((r): r is string => r !== null))].sort(),
    [actors]
  );

  const filtered = useMemo(() => {
    let result = [...actors];
    if (typeFilter) result = result.filter((a) => a.actorType === typeFilter);
    if (regionFilter) result = result.filter((a) => a.region === regionFilter);
    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return dir * a.name.localeCompare(b.name);
      return dir * (((a[sortBy] as number) ?? -1) - ((b[sortBy] as number) ?? -1));
    });
    return result;
  }, [actors, typeFilter, regionFilter, sortBy, sortDir]);

  function toggleSort(field: SortKey) {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#111111] border border-[#1f2937] text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#3b82f6] transition-colors"
        >
          <option value="">All Types</option>
          {actorTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="bg-[#111111] border border-[#1f2937] text-gray-300 text-sm rounded px-3 py-1.5 focus:outline-none focus:border-[#3b82f6] transition-colors"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-600">
          {filtered.length} actor{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs border-b border-[#1f2937]">
              <th className="pb-3 pr-4 text-gray-500">Rank</th>
              <SortHeader
                label="Name"
                field="name"
                sortBy={sortBy}
                sortDir={sortDir}
                onClick={toggleSort}
              />
              <th className="pb-3 pr-4 text-gray-500">Type</th>
              <SortHeader
                label="Authority"
                field="authorityScore"
                sortBy={sortBy}
                sortDir={sortDir}
                onClick={toggleSort}
              />
              <SortHeader
                label="Reach"
                field="reachScore"
                sortBy={sortBy}
                sortDir={sortDir}
                onClick={toggleSort}
              />
              <SortHeader
                label="PF Score"
                field="pfScore"
                sortBy={sortBy}
                sortDir={sortDir}
                onClick={toggleSort}
              />
              <th className="pb-3 pr-4 text-gray-500">Vector</th>
              <th className="pb-3 pr-4 text-gray-500">Region</th>
              <th className="pb-3 text-gray-500">Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2937]">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-16 text-center text-gray-500 text-sm"
                >
                  No actors found
                </td>
              </tr>
            ) : (
              filtered.map((actor, idx) => {
                const delta = snapshotDeltaMap[actor.id] ?? 0;
                const scoreColor = pfScoreColor(actor.pfScore ?? 0);
                return (
                  <tr
                    key={actor.id}
                    className="hover:bg-[#111111]/60 transition-colors"
                  >
                    <td className="py-3 pr-4 text-gray-600 tabular-nums text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/actors/${actor.slug}`}
                        className="text-white hover:text-[#3b82f6] transition-colors font-medium"
                      >
                        {actor.name || "—"}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <ActorTypeBadge type={actor.actorType} />
                    </td>
                    <td className="py-3 pr-4 text-gray-300 tabular-nums">
                      {actor.authorityScore ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 tabular-nums">
                      {actor.reachScore ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="font-bold text-base tabular-nums"
                        style={{ color: scoreColor }}
                      >
                        {actor.pfScore ?? "—"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">
                      {actor.pfVector || "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">
                      {actor.region || "—"}
                    </td>
                    <td className="py-3">
                      <ScoreDelta delta={delta} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
