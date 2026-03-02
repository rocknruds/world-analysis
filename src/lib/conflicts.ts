import {
  notionQueryAll,
  CONFLICTS_DB_ID,
  getPageTitle,
  getRichText,
  getSelect,
  getRelation,
} from "./notion";

export interface Conflict {
  id: string;
  name: string;
  region: string;
  type: string;
  status: string;
  primaryActors: string;
  escalationLevel: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseConflict(page: Record<string, any>): Conflict {
  const p = page.properties ?? {};
  // Primary Actors may be a text field or relation — handle both
  const primaryActorsText =
    getRichText(p, "Primary Actors") || getRichText(p, "Primary Actor");
  const primaryActorsRelation = getRelation(p, "Primary Actors");

  return {
    id: page.id as string,
    name: getPageTitle(p),
    region: getSelect(p, "Region"),
    type: getSelect(p, "Type") || getSelect(p, "Conflict Type"),
    status: getSelect(p, "Status"),
    primaryActors:
      primaryActorsText ||
      (primaryActorsRelation.length > 0
        ? `${primaryActorsRelation.length} actor${primaryActorsRelation.length !== 1 ? "s" : ""}`
        : ""),
    escalationLevel: getSelect(p, "Escalation Level"),
  };
}

export async function getAllPublicConflicts(): Promise<Conflict[]> {
  const pages = await notionQueryAll(CONFLICTS_DB_ID, {
    filter: { property: "Visibility", select: { equals: "Public" } },
    page_size: 100,
  });
  return pages.map(parseConflict);
}
