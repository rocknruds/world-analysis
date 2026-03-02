import {
  notionFetch,
  notionQueryAll,
  SCORE_SNAPSHOTS_DB_ID,
  calcPFScore,
  getNumber,
  getDate,
  getRelation,
  getRollupText,
  getRichText,
} from "./notion";

export interface ScoreSnapshot {
  id: string;
  actorIds: string[];
  actorName: string;
  date: string;
  authorityScore: number;
  reachScore: number;
  pfScore: number;
  scoreDelta: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSnapshot(page: Record<string, any>): ScoreSnapshot {
  const p = page.properties ?? {};
  const auth = getNumber(p, "Authority Score");
  const reach = getNumber(p, "Reach Score");
  const stored = getNumber(p, "PF Score");
  // Actor name may appear as rollup or rich_text
  const actorName =
    getRollupText(p, "Actor Name") ||
    getRichText(p, "Actor Name") ||
    "";
  return {
    id: page.id as string,
    actorIds: getRelation(p, "Actor"),
    actorName,
    date: getDate(p, "Snapshot Date"),
    authorityScore: auth,
    reachScore: reach,
    pfScore: stored || calcPFScore(auth, reach),
    scoreDelta: getNumber(p, "Score Delta"),
  };
}

// Recent snapshots with non-zero delta, used for the homepage Score Movers strip
export async function getRecentScoreMovers(limit = 10): Promise<ScoreSnapshot[]> {
  const data = await notionFetch(`/databases/${SCORE_SNAPSHOTS_DB_ID}/query`, {
    filter: {
      or: [
        { property: "Score Delta", number: { greater_than: 0 } },
        { property: "Score Delta", number: { less_than: 0 } },
      ],
    },
    sorts: [{ property: "Snapshot Date", direction: "descending" }],
    page_size: limit,
  });
  if (!data) return [];
  return (data.results ?? []).map(parseSnapshot);
}

// Score history for a specific actor, sorted ascending for chart rendering
export async function getActorScoreHistory(actorId: string): Promise<ScoreSnapshot[]> {
  const pages = await notionQueryAll(SCORE_SNAPSHOTS_DB_ID, {
    filter: {
      property: "Actor",
      relation: { contains: actorId },
    },
    sorts: [{ property: "Snapshot Date", direction: "ascending" }],
    page_size: 100,
  });
  return pages.map(parseSnapshot);
}
