// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Accelegator043I18n } from "./op18-043-accelegator.i18n.ts";

export const localOp18Accelegator043: CharacterCard = {
  id: "OP18-043",
  canonicalId: "OP18-043",
  slug: "accelegator/op18-043",
  name: "Accelegator",
  printings: [
    {
      id: "OP18-043",
      artId: "OP18-043",
      setCode: "OP18",
      collectorNumber: "043",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-043.png",
      label: "Accelegator (OP18-043)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Animal", "Alabasta", "Baroque Works"],
  attribute: "strike",
  i18n: localOp18Accelegator043I18n,
};
