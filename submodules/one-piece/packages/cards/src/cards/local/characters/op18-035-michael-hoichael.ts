// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18MichaelHoichael035I18n } from "./op18-035-michael-hoichael.i18n.ts";

export const localOp18MichaelHoichael035: CharacterCard = {
  id: "OP18-035",
  canonicalId: "OP18-035",
  slug: "michael-hoichael/op18-035",
  name: "Michael & Hoichael",
  printings: [
    {
      id: "OP18-035",
      artId: "OP18-035",
      setCode: "OP18",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-035.png",
      label: "Michael & Hoichael (OP18-035)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Water Seven"],
  attribute: "wisdom",
  i18n: localOp18MichaelHoichael035I18n,
};
