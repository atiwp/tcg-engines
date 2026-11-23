// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18OimoKashii062I18n } from "./op18-062-oimo-kashii.i18n.ts";

export const localOp18OimoKashii062: CharacterCard = {
  id: "OP18-062",
  canonicalId: "OP18-062",
  slug: "oimo-kashii/op18-062",
  name: "Oimo & Kashii",
  printings: [
    {
      id: "OP18-062",
      artId: "OP18-062",
      setCode: "OP18",
      collectorNumber: "062",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-062.png",
      label: "Oimo & Kashii (OP18-062)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP18",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["Giant", "World Government"],
  attribute: "strike",
  i18n: localOp18OimoKashii062I18n,
};
