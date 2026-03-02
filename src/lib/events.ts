import { notionQueryAll, EVENTS_DB_ID, getTitle, getRichText, getSelect, getDate, getRelation } from "./notion";

export interface NotionEvent {
  id: string;
  name: string;
  date: string;
  eventType: string;
  pfSignal: string;
  description: string;
  actorIds: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEvent(page: Record<string, any>): NotionEvent {
  const p = page.properties ?? {};
  return {
    id: page.id as string,
    name: getTitle(p, "Event Name") || getTitle(p, "Name"),
    date: getDate(p, "Date"),
    eventType: getSelect(p, "Event Type"),
    pfSignal: getSelect(p, "PF Signal"),
    description: getRichText(p, "Description"),
    actorIds: getRelation(p, "Key Actors"),
  };
}

// Events linked to a specific actor via Key Actors relation
export async function getActorEvents(actorId: string, limit = 5): Promise<NotionEvent[]> {
  const pages = await notionQueryAll(EVENTS_DB_ID, {
    filter: {
      and: [
        { property: "Visibility", select: { equals: "Public" } },
        { property: "Key Actors", relation: { contains: actorId } },
      ],
    },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: limit,
  });
  return pages.slice(0, limit).map(parseEvent);
}
