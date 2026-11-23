// OP Practice local cards (fork-only): local definitions never shadow upstream ones.
import { describe, expect, test } from "vite-plus/test";
import type { OPCard } from "@tcg/op-types";
import {
  addLocalCards,
  allCards,
  getCard,
  hasCard,
  localCardIdsDefinedUpstream,
  validateDeckForFormat,
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
  test("the local EB05 and OP18 cards are registered while upstream lacks them", () => {
    const localIds = localCards.map((card) => card.id).sort();
    const eb05 = localIds.filter((id) => id.startsWith("EB05-"));
    expect(new Set(localIds).size).toBe(localIds.length);
    // Every EB05 card, EB05-001 to EB05-061.
    expect(eb05).toEqual(
      Array.from({ length: 61 }, (_, i) => `EB05-${String(i + 1).padStart(3, "0")}`),
    );
    const op18 = localIds.filter((id) => id.startsWith("OP18-"));
    expect(localIds.filter((id) => !id.startsWith("EB05-") && !id.startsWith("OP18-"))).toEqual([]);
    expect(op18.every((id) => /^OP18-(0\d\d|1[01]\d)$/.test(id) && id !== "OP18-000")).toBe(true);
    for (const card of localCards) {
      expect(upstreamIds.has(card.id)).toBe(false);
      expect(hasCard(card.id)).toBe(true);
      expect(getCard(card.id)).toBe(card);
    }
    expect(localCardIdsDefinedUpstream).toEqual([]);
    expect(allCards.filter((card) => card.setId === "EB05")).toHaveLength(eb05.length);
    expect(allCards.filter((card) => card.setId === "OP18")).toHaveLength(op18.length);
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

  test("OP18-093 Sleeptids may be in a deck any number of times, like upstream's unlimited-copy cards", () => {
    const copyLimit = (sleeptids: number, killingham: number) =>
      validateDeckForFormat("standard", [
        { cardId: "OP18-060", quantity: 1 },
        { cardId: "OP18-093", quantity: sleeptids },
        { cardId: "OP18-083", quantity: killingham },
      ]).rules.find((rule) => rule.kind === "copy-limit")?.passed;
    expect(getCard("OP18-093").effects?.deckBuildingRules).toEqual([{ rule: "unlimitedCopies" }]);
    expect(copyLimit(46, 4)).toBe(true);
    expect(copyLimit(45, 5)).toBe(false);
  });
});
