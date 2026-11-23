// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Yamakaji112I18n } from "./op18-112-yamakaji.i18n.ts";

export const localOp18Yamakaji112: CharacterCard = {
  id: "OP18-112",
  canonicalId: "OP18-112",
  slug: "yamakaji/op18-112",
  name: "Yamakaji",
  printings: [
    {
      id: "OP18-112",
      artId: "OP18-112",
      setCode: "OP18",
      collectorNumber: "112",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-112.png",
      label: "Yamakaji (OP18-112)",
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
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: localOp18Yamakaji112I18n,
};
