import {
  notionQueryAll,
  SCENARIOS_DB_ID,
  getPageTitle,
  getRichText,
  getSelect,
  getRelation,
  getNumber,
} from "./notion";

export interface Scenario {
  id: string;
  name: string;
  scenarioClass: string;
  probabilityEstimate: number | string;
  triggerCondition: string;
  status: string;
  actorIds: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseScenario(page: Record<string, any>): Scenario {
  const p = page.properties ?? {};
  const probNum = getNumber(p, "Probability Estimate");
  const probStr = getSelect(p, "Probability Estimate");
  return {
    id: page.id as string,
    name: getPageTitle(p),
    scenarioClass: getSelect(p, "Scenario Class"),
    probabilityEstimate: probNum || probStr || "",
    triggerCondition: getRichText(p, "Trigger Condition"),
    status: getSelect(p, "Status"),
    actorIds: getRelation(p, "Key Actors"),
  };
}

export async function getActiveScenarios(): Promise<Scenario[]> {
  const pages = await notionQueryAll(SCENARIOS_DB_ID, {
    filter: {
      and: [
        { property: "Visibility", select: { equals: "Public" } },
        { property: "Status", select: { equals: "Active" } },
      ],
    },
    page_size: 100,
  });
  return pages.map(parseScenario);
}

export async function getActorScenarios(actorId: string): Promise<Scenario[]> {
  const pages = await notionQueryAll(SCENARIOS_DB_ID, {
    filter: {
      and: [
        { property: "Visibility", select: { equals: "Public" } },
        { property: "Key Actors", relation: { contains: actorId } },
      ],
    },
    page_size: 100,
  });
  return pages.map(parseScenario);
}
