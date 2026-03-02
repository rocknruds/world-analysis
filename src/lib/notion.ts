// Notion database IDs
export const ACTORS_DB_ID = "7aa6bbc818ad4a35a4059fbe2537d115";
export const SCORE_SNAPSHOTS_DB_ID = "e96696510cac4435a52e89be9fb6a969";
export const EVENTS_DB_ID = "70e9768bfcec49a9aa8565d5aa1f1881";
export const BRIEFS_DB_ID = "df4e70c01fa1460d8f9bb6c26f05dc1a";
export const SCENARIOS_DB_ID = "430eb13962d44154b9761785faf01300";
export const CONFLICTS_DB_ID = "db9f622892a74cdd942981c330e90886";

// PF Score composite: Authority (60%) + Reach (40%)
export const calcPFScore = (authority: number, reach: number) =>
  Math.round(authority * 0.6 + reach * 0.4);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NP = Record<string, any>;

export function getTitle(props: NP, key: string): string {
  try {
    return (props[key]?.title ?? []).map((t: NP) => t.plain_text as string).join("");
  } catch {
    return "";
  }
}

export function getPageTitle(props: NP): string {
  try {
    for (const val of Object.values(props)) {
      if ((val as NP)?.type === "title") {
        return ((val as NP).title ?? []).map((t: NP) => t.plain_text as string).join("");
      }
    }
    return "";
  } catch {
    return "";
  }
}

export function getRichText(props: NP, key: string): string {
  try {
    return (props[key]?.rich_text ?? []).map((t: NP) => t.plain_text as string).join("");
  } catch {
    return "";
  }
}

export function getNumber(props: NP, key: string): number {
  try {
    return (props[key]?.number as number) ?? 0;
  } catch {
    return 0;
  }
}

export function getSelect(props: NP, key: string): string {
  try {
    return (props[key]?.select?.name as string) ?? "";
  } catch {
    return "";
  }
}

export function getDate(props: NP, key: string): string {
  try {
    return (props[key]?.date?.start as string) ?? "";
  } catch {
    return "";
  }
}

export function getRelation(props: NP, key: string): string[] {
  try {
    return (props[key]?.relation ?? []).map((r: NP) => r.id as string);
  } catch {
    return [];
  }
}

export function getRollupText(props: NP, key: string): string {
  try {
    const rollup = props[key]?.rollup;
    if (!rollup) return "";
    if (rollup.type === "array") {
      return (rollup.array ?? [])
        .map((item: NP) => {
          if (item.type === "title") return (item.title ?? []).map((t: NP) => t.plain_text).join("");
          if (item.type === "rich_text") return (item.rich_text ?? []).map((t: NP) => t.plain_text).join("");
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }
    return "";
  } catch {
    return "";
  }
}

export async function notionFetch(endpoint: string, body?: object): Promise<NP | null> {
  const url = `https://api.notion.com/v1${endpoint}`;
  try {
    const res = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`Notion ${res.status}: ${endpoint}`);
      return null;
    }
    return res.json() as Promise<NP>;
  } catch (err) {
    console.error("Notion fetch error:", err);
    return null;
  }
}

// Handles cursor pagination — fetches all pages from a Notion database query
export async function notionQueryAll(dbId: string, body: object): Promise<NP[]> {
  const results: NP[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const payload = cursor ? { ...body, start_cursor: cursor } : body;
    const data = await notionFetch(`/databases/${dbId}/query`, payload);
    if (!data) break;
    results.push(...(data.results ?? []));
    hasMore = data.has_more === true;
    cursor = data.next_cursor ?? undefined;
  }

  return results;
}
