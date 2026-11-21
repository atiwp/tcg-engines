// OP Practice local cards (fork-only): local definitions never shadow upstream ones.
import { describe, expect, test } from "vite-plus/test";
import type { OPCard } from "@tcg/op-types";
import {
  addLocalCards,
  allCards,
  getCard,
  hasCard,
  localCardIdsDefinedUpstream,
} from "../src/index.ts";
import * as upstreamDefinitions from "../src/cards/index.ts";
import * as localDefinitions from "../src/cards/local/index.ts";

const isCard = (value: unknown): value is OPCard =>
  Boolean(value) && typeof (value as OPCard).id === "string";
const localCards = Object.values(localDefinitions).filter(isCard);
const upstreamIds = new Set(
  Object.values(upstreamDefinitions)
    .filter(isCard)
    .map((c) => c.id),
);

describe("OP Practice local cards", () => {
  test("the twelve EB05 local cards are registered while upstream lacks them", () => {
    expect(localCards.map((card) => card.id).sort()).toEqual([
      "EB05-001",
      "EB05-010",
      "EB05-012",
      "EB05-016",
      "EB05-021",
      "EB05-028",
      "EB05-047",
      "EB05-052",
      "EB05-053",
      "EB05-055",
      "EB05-056",
      "EB05-057",
    ]);
    for (const card of localCards) {
      expect(upstreamIds.has(card.id)).toBe(false);
      expect(hasCard(card.id)).toBe(true);
      expect(getCard(card.id)).toBe(card);
    }
    expect(localCardIdsDefinedUpstream).toEqual([]);
    expect(allCards.filter((card) => card.setId === "EB05")).toHaveLength(12);
  });

  test("a local card whose id upstream already defines is skipped (upstream wins)", () => {
    const upstream = getCard("OP13-001");
    const cards = new Map<string, OPCard>([[upstream.id, upstream]]);
    const localCopy = { ...upstream, name: "Local copy" } as OPCard;
    const [eb05] = localCards;

    const definedUpstream = addLocalCards(cards, [localCopy, eb05, "not a card"]);

    expect(definedUpstream).toEqual(["OP13-001"]);
    expect(cards.get("OP13-001")).toBe(upstream);
    expect(cards.get(eb05!.id)).toBe(eb05);
    expect(cards.size).toBe(2);
  });
});
