import type { OPCard } from "@tcg/op-types";
import { RecordCardCatalog } from "@tcg/op-types";
import {
  getCard as getRuntimeCard,
  hasCard as hasRuntimeCard,
  registerCards,
} from "./runtime-catalog.ts";
import * as cardDefinitions from "./cards/index.ts";
// OP Practice local cards (fork-only).
import * as localCardDefinitions from "./cards/local/index.ts";

function isCardDefinition(value: unknown): value is OPCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OPCard>;
  return typeof candidate.id === "string" && typeof candidate.cardType === "string";
}

const uniqueCards = new Map<string, OPCard>();
for (const value of Object.values(cardDefinitions)) {
  if (!isCardDefinition(value)) {
    continue;
  }

  uniqueCards.set(value.id, value);
}

// OP Practice local cards (fork-only): added only when upstream lacks the id, so the
// engine's own definition always wins. Returns the local ids upstream now defines.
export function addLocalCards(cards: Map<string, OPCard>, local: Iterable<unknown>): string[] {
  const definedUpstream: string[] = [];
  for (const value of local) {
    if (!isCardDefinition(value)) continue;
    if (cards.has(value.id)) definedUpstream.push(value.id);
    else cards.set(value.id, value);
  }
  return definedUpstream;
}
export const localCardIdsDefinedUpstream: readonly string[] = Object.freeze(
  addLocalCards(uniqueCards, Object.values(localCardDefinitions)),
);

export const allCards = Object.freeze(
  [...uniqueCards.values()].sort((left, right) => left.id.localeCompare(right.id)),
);

export const cardCatalog = new RecordCardCatalog<OPCard>(
  "one-piece-card-catalog",
  Object.fromEntries(allCards.map((card) => [card.id, card])),
);

registerCards(allCards);

export function getCard(id: string): OPCard {
  return getRuntimeCard(id);
}

export function getAllCards(): readonly OPCard[] {
  return allCards;
}

export function hasCard(id: string): boolean {
  return hasRuntimeCard(id);
}

export * from "./cards/index.ts";
// OP Practice local cards (fork-only).
export * from "./cards/local/index.ts";
export * from "./deck-validation.ts";
export { legacyPrintingIdAliases } from "./legacy-printing-id-aliases.generated.ts";
export * from "./preconstructed-decks.ts";
