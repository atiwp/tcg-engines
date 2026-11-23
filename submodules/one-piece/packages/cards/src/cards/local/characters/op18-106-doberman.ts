// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Doberman106I18n } from "./op18-106-doberman.i18n.ts";

export const localOp18Doberman106: CharacterCard = {
  id: "OP18-106",
  canonicalId: "OP18-106",
  slug: "doberman/op18-106",
  name: "Doberman",
  printings: [
    {
      id: "OP18-106",
      artId: "OP18-106",
      setCode: "OP18",
      collectorNumber: "106",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-106.png",
      label: "Doberman (OP18-106)",
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
  effect: "[Double Attack] (This card deals 2 damage.)",
  effects: {
    keywords: ["doubleAttack"],
  },
  i18n: localOp18Doberman106I18n,
};
