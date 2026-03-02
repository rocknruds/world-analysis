import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublicActors, getActorById } from "@/lib/actors";
import { getActorScoreHistory } from "@/lib/scores";
import { getActorEvents } from "@/lib/events";
import { getActorScenarios } from "@/lib/scenarios";
import { calcPFScore } from "@/lib/notion";
import PFScoreBar from "@/components/PFScoreBar";
import ScoreDelta from "@/components/ScoreDelta";
import ScoreChart from "@/components/ScoreChart";
import { pfScoreColor, actorTypeBadgeColor } from "@/components/ActorCard";

export const revalidate = 300;

export async function generateStaticParams() {
  const actors = await getAllPublicActors();
  return actors.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const actor = await getActorById(slug);
  return { title: actor?.name ?? "Actor Profile" };
}

function PFSignalBadge({ signal }: { signal: string }) {
  if (!signal) return null;
  const colors: Record<string, { text: string; bg: string }> = {
    Widening: { text: "#ef4444", bg: "#ef444415" },
    Narrowing: { text: "#22c55e", bg: "#22c55e15" },
    Stable: { text: "#6b7280", bg: "#6b728015" },
    Unclear: { text: "#eab308", bg: "#eab30815" },
  };
  const c = colors[signal] ?? { text: "#9ca3af", bg: "#9ca3af15" };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded font-medium"
      style={{ color: c.text, backgroundColor: c.bg }}
    >
      {signal}
    </span>
  );
}

export default async function ActorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [actor, history, events, scenarios] = await Promise.all([
    getActorById(slug),
    getActorScoreHistory(slug),
    getActorEvents(slug, 5),
    getActorScenarios(slug),
  ]);

  if (!actor) notFound();

  const pf = calcPFScore(actor.authorityScore, actor.reachScore);
  const scoreColor = pfScoreColor(pf);
  const latestDelta = history.length > 0 ? history[history.length - 1].scoreDelta : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1f2937] py-10">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/actors"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Actor Leaderboard
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {actor.actorType && (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded border"
                    style={{
                      color: actorTypeBadgeColor(actor.actorType),
                      borderColor: `${actorTypeBadgeColor(actor.actorType)}40`,
                      backgroundColor: `${actorTypeBadgeColor(actor.actorType)}12`,
                    }}
                  >
                    {actor.actorType}
                  </span>
                )}
                {actor.region && (
                  <span className="text-xs text-gray-500 px-2 py-0.5 border border-[#1f2937] rounded">
                    {actor.region}
                  </span>
                )}
                {actor.iso3 && (
                  <span className="text-xs text-gray-600 font-mono">
                    {actor.iso3}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white">
                {actor.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-5xl font-bold tabular-nums"
                style={{ color: scoreColor }}
              >
                {pf || "—"}
              </span>
              {latestDelta !== 0 && <ScoreDelta delta={latestDelta} />}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* PF Score Breakdown */}
        <section className="bg-[#111111] border border-[#1f2937] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-4 bg-[#3b82f6] rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              PF Score Breakdown
            </h2>
          </div>
          <PFScoreBar
            authority={actor.authorityScore}
            reach={actor.reachScore}
            pf={pf}
          />
          <div className="mt-5 pt-5 border-t border-[#1f2937] grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Authority</p>
              <p className="text-2xl font-bold text-[#60a5fa] tabular-nums">
                {actor.authorityScore || "—"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">× 0.6 weight</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Reach</p>
              <p className="text-2xl font-bold text-[#f97316] tabular-nums">
                {actor.reachScore || "—"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">× 0.4 weight</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">PF Score</p>
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: scoreColor }}
              >
                {pf || "—"}
              </p>
              {actor.pfVector && (
                <p className="text-xs text-gray-600 mt-0.5">{actor.pfVector}</p>
              )}
            </div>
          </div>
        </section>

        {/* Score History Chart */}
        <section className="bg-[#111111] border border-[#1f2937] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-4 bg-[#3b82f6] rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Score History
            </h2>
          </div>
          <ScoreChart snapshots={history} />
        </section>

        {/* Recent Events */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-[#3b82f6] rounded-full" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Recent Events
            </h2>
          </div>
          {events.length === 0 ? (
            <div className="rounded-lg border border-[#1f2937] bg-[#111111] px-5 py-8 text-center text-sm text-gray-600">
              No linked events found.
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#111111] border border-[#1f2937] rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {event.name || "Unnamed Event"}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {event.date && (
                        <span className="text-xs text-gray-600 tabular-nums">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {event.eventType && (
                        <span className="text-xs px-2 py-0.5 rounded border border-[#1f2937] text-gray-400">
                          {event.eventType}
                        </span>
                      )}
                      <PFSignalBadge signal={event.pfSignal} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Scenarios */}
        {scenarios.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-[#3b82f6] rounded-full" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Active Scenarios
              </h2>
            </div>
            <div className="space-y-2">
              {scenarios.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#111111] border border-[#1f2937] rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-white">
                      {s.name}
                    </p>
                    {s.probabilityEstimate !== "" &&
                      s.probabilityEstimate !== 0 && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/30 tabular-nums shrink-0">
                          {typeof s.probabilityEstimate === "number"
                            ? `${s.probabilityEstimate}%`
                            : s.probabilityEstimate}
                        </span>
                      )}
                  </div>
                  {s.scenarioClass && (
                    <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                      {s.scenarioClass}
                    </span>
                  )}
                  {s.triggerCondition && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {s.triggerCondition.slice(0, 100)}
                      {s.triggerCondition.length > 100 && "…"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {actor.notes && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-[#3b82f6] rounded-full" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Notes
              </h2>
            </div>
            <div className="bg-[#111111] border border-[#1f2937] rounded-xl p-6">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {actor.notes}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
