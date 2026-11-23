// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Onigumo098I18n } from "./op18-098-onigumo.i18n.ts";

export const localOp18Onigumo098: CharacterCard = {
  id: "OP18-098",
  canonicalId: "OP18-098",
  slug: "onigumo/op18-098",
  name: "Onigumo",
  printings: [
    {
      id: "OP18-098",
      artId: "OP18-098",
      setCode: "OP18",
      collectorNumber: "098",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-098.png",
      label: "Onigumo (OP18-098)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP18",
  cost: 7,
  power: 7000,
  counter: 2000,
  traits: ["Vice Admiral", "Navy"],
  attribute: "slash",
  effect: "[Unblockable] (This card cannot be blocked.)",
  effects: {
    keywords: ["unblockable"],
  },
  i18n: localOp18Onigumo098I18n,
};
