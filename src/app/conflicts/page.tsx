import { getAllPublicConflicts } from "@/lib/conflicts";

export const revalidate = 300;

export const metadata = {
  title: "Conflicts Overview",
};

function EscalationBadge({ level }: { level: string }) {
  if (!level) return <span className="text-gray-600">—</span>;
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    Critical: { text: "#ef4444", bg: "#ef444415", border: "#ef444430" },
    High: { text: "#f97316", bg: "#f9731615", border: "#f9731630" },
    Medium: { text: "#eab308", bg: "#eab30815", border: "#eab30830" },
    Low: { text: "#22c55e", bg: "#22c55e15", border: "#22c55e30" },
    Frozen: { text: "#6b7280", bg: "#6b728015", border: "#6b728030" },
  };
  const c = colors[level] ?? { text: "#9ca3af", bg: "#9ca3af15", border: "#9ca3af30" };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded border font-semibold"
      style={{ color: c.text, backgroundColor: c.bg, borderColor: c.border }}
    >
      {level}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (!status) return <span className="text-gray-600">—</span>;
  const active = ["Active", "Ongoing", "Escalating"].includes(status);
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${
        active
          ? "text-[#ef4444] bg-[#ef444415] border border-[#ef444430]"
          : "text-gray-500 bg-[#1f2937]/50 border border-[#1f2937]"
      }`}
    >
      {status}
    </span>
  );
}

export default async function ConflictsPage() {
  const conflicts = await getAllPublicConflicts();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Page header */}
      <div className="border-b border-[#1f2937] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
              Global Conflicts Registry
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Conflicts Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Phase 1 — tabular view.{" "}
            {conflicts.length} conflict{conflicts.length !== 1 ? "s" : ""}{" "}
            tracked.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {conflicts.length === 0 ? (
          <div className="rounded-lg border border-[#1f2937] bg-[#111111] px-6 py-16 text-center text-sm text-gray-600">
            No public conflicts in the registry yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-[#1f2937]">
                  <th className="pb-3 pr-6 font-semibold">Conflict Name</th>
                  <th className="pb-3 pr-6 font-semibold">Region</th>
                  <th className="pb-3 pr-6 font-semibold">Type</th>
                  <th className="pb-3 pr-6 font-semibold">Status</th>
                  <th className="pb-3 pr-6 font-semibold">Primary Actors</th>
                  <th className="pb-3 font-semibold">Escalation Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]">
                {conflicts.map((conflict) => (
                  <tr
                    key={conflict.id}
                    className="hover:bg-[#111111]/60 transition-colors"
                  >
                    <td className="py-4 pr-6">
                      <span className="font-semibold text-white">
                        {conflict.name || "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-gray-400 text-xs">
                      {conflict.region || "—"}
                    </td>
                    <td className="py-4 pr-6 text-gray-400 text-xs">
                      {conflict.type || "—"}
                    </td>
                    <td className="py-4 pr-6">
                      <StatusBadge status={conflict.status} />
                    </td>
                    <td className="py-4 pr-6 text-gray-400 text-xs max-w-[180px]">
                      <span className="line-clamp-2">
                        {conflict.primaryActors || "—"}
                      </span>
                    </td>
                    <td className="py-4">
                      <EscalationBadge level={conflict.escalationLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
