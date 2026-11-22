import { readFileSync } from "node:fs";
import * as opCards from "@tcg/op-cards";
import { allCards, getCard } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";

/**
 * Catalog invariant: inventory vanillas have no printed or executable ability.
 * Lives in the default suite (tests/cards) so CI always runs it.
 */

const inventory = readFileSync(
  new URL("../../../../docs/card-behavior-character-inventory.md", import.meta.url),
  "utf8",
);
const vanillaCharacterIds = inventory
  .split("\n")
  .map((line) => /^\|\s*([^|]+?)\s*\|[^|]*\|\s*vanilla\s*\|/.exec(line)?.[1]?.trim())
  .filter((id): id is string => Boolean(id));

// OP Practice local cards (fork-only): not in the upstream inventory document.
const localCardIds = new Set(
  Object.entries(opCards)
    .filter(
      ([name, value]) => name.startsWith("local") && typeof value === "object" && value !== null,
    )
    .map(([, value]) => (value as { id: string }).id),
);

function isBlankAbilityText(text: string | undefined) {
  return text === undefined || text.trim() === "" || /^(?:NULL|-)$/i.test(text.trim());
}

describe("canonical vanilla Character catalog", () => {
  test("contains the complete unique vanilla inventory", () => {
    expect(vanillaCharacterIds.length).toBeGreaterThan(0);
    expect(new Set(vanillaCharacterIds).size).toBe(vanillaCharacterIds.length);
    const catalogVanillas = allCards
      .filter(
        (card) =>
          card.cardType === "character" &&
          isBlankAbilityText(card.effect) &&
          isBlankAbilityText(card.trigger) &&
          isBlankAbilityText(card.i18n.en.effect) &&
          card.effects === undefined &&
          !localCardIds.has(card.id),
      )
      .map((card) => card.id);
    expect([...vanillaCharacterIds].sort()).toEqual(catalogVanillas.sort());
  });

  test.each(vanillaCharacterIds)("%s has no printed or executable ability", (cardId) => {
    const card = getCard(cardId);

    expect(card.cardType).toBe("character");
    if (card.cardType !== "character") return;
    expect(isBlankAbilityText(card.effect)).toBe(true);
    expect(isBlankAbilityText(card.trigger)).toBe(true);
    expect(card.effects).toBeUndefined();
    expect(isBlankAbilityText(card.i18n.en.effect)).toBe(true);
  });
});
