import {
  notionFetch,
  notionQueryAll,
  ACTORS_DB_ID,
  calcPFScore,
  getTitle,
  getRichText,
  getNumber,
  getSelect,
} from "./notion";

export interface Actor {
  id: string;
  name: string;
  actorType: string;
  authorityScore: number;
  reachScore: number;
  pfScore: number;
  pfVector: string;
  region: string;
  iso3: string;
  notes: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseActor(page: Record<string, any>): Actor {
  const p = page.properties ?? {};
  const auth = getNumber(p, "Authority Score");
  const reach = getNumber(p, "Reach Score");
  return {
    id: page.id as string,
    name: getTitle(p, "Name"),
    actorType: getSelect(p, "Actor Type"),
    authorityScore: auth,
    reachScore: reach,
    pfScore: calcPFScore(auth, reach),
    pfVector: getSelect(p, "PF Vector"),
    region: getSelect(p, "Region"),
    iso3: getRichText(p, "ISO3 / Identifier"),
    notes: getRichText(p, "Notes"),
  };
}

export async function getAllPublicActors(): Promise<Actor[]> {
  const pages = await notionQueryAll(ACTORS_DB_ID, {
    filter: { property: "Visibility", select: { equals: "Public" } },
    page_size: 100,
  });
  return pages.map(parseActor).sort((a, b) => b.pfScore - a.pfScore);
}

export async function getActorById(id: string): Promise<Actor | null> {
  const page = await notionFetch(`/pages/${id}`);
  if (!page) return null;
  return parseActor(page);
}
