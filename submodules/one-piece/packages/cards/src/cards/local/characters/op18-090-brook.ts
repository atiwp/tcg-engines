// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Brook090I18n } from "./op18-090-brook.i18n.ts";

export const localOp18Brook090: CharacterCard = {
  id: "OP18-090",
  canonicalId: "OP18-090",
  slug: "brook/op18-090",
  name: "Brook",
  printings: [
    {
      id: "OP18-090",
      artId: "OP18-090",
      setCode: "OP18",
      collectorNumber: "090",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-090.png",
      label: "Brook (OP18-090)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP18",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  i18n: localOp18Brook090I18n,
};
