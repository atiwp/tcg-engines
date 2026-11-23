// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Jerry102I18n } from "./op18-102-jerry.i18n.ts";

export const localOp18Jerry102: CharacterCard = {
  id: "OP18-102",
  canonicalId: "OP18-102",
  slug: "jerry/op18-102",
  name: "Jerry",
  printings: [
    {
      id: "OP18-102",
      artId: "OP18-102",
      setCode: "OP18",
      collectorNumber: "102",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-102.png",
      label: "Jerry (OP18-102)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP18",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["CP6"],
  attribute: "strike",
  i18n: localOp18Jerry102I18n,
};
