import { getAllPublicActors } from "@/lib/actors";
import { getLatestDeltaByActor } from "@/lib/scores";
import ActorTable from "@/components/ActorTable";

export const revalidate = 300;

export const metadata = {
  title: "Actor Leaderboard",
};

export default async function ActorsPage() {
  const [actors, deltaMap] = await Promise.all([
    getAllPublicActors(),
    getLatestDeltaByActor(),
  ]);
  
  const snapshotDeltaMap: Record<string, number> = {};
  for (const [id, delta] of deltaMap.entries()) {
    if (delta !== null) snapshotDeltaMap[id] = delta;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Page header */}
      <div className="border-b border-[#1f2937] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
              PowerFlow Lab
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Actor Leaderboard
          </h1>
          <p className="text-gray-500 text-sm">
            {actors.length} tracked actor{actors.length !== 1 ? "s" : ""} —
            ranked by PF Score (Authority × 0.6 + Reach × 0.4)
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {actors.length === 0 ? (
          <div className="rounded-lg border border-[#1f2937] bg-[#111111] px-6 py-16 text-center text-sm text-gray-600">
            No public actors in the database yet.
          </div>
        ) : (
          <ActorTable actors={actors} snapshotDeltaMap={snapshotDeltaMap} />
        )}
      </div>
    </div>
  );
}
