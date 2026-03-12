import { queryDatabase, getTitle, getText, getSelect, getDate, getRelationIds } from "./notion";

const EVENTS_DB_ID = process.env.NOTION_EVENTS_DB_ID ?? "70e9768bfcec49a9aa8565d5aa1f1881";

export interface NotionEvent {
  id: string;
  name: string;
  date: string;
  eventType: string;
  pfSignal: string;
  description: string;
  actorIds: string[];
}

function parseEvent(page: Record<string, any>): NotionEvent {
  const p = page.properties ?? {};
  return {
    id: page.id as string,
    name: getTitle(p, "Event Name") || getTitle(p, "Name"),
    date: getDate(p, "Date"),
    eventType: getSelect(p, "Event Type"),
    pfSignal: getSelect(p, "PF Signal"),
    description: getText(p, "Description"),
    actorIds: getRelationIds(p, "Key Actors"),
  };
}

export async function getActorEvents(actorId: string, limit = 5): Promise<NotionEvent[]> {
  const pages = await queryDatabase(
    EVENTS_DB_ID,
    {
      property: "Key Actors",
      relation: { contains: actorId },
    },
    [{ property: "Date", direction: "descending" }]
  );
  return pages.slice(0, limit).map(parseEvent);
}
