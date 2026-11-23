// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18SeaCat003I18n } from "./op18-003-sea-cat.i18n.ts";

export const localOp18SeaCat003: CharacterCard = {
  id: "OP18-003",
  canonicalId: "OP18-003",
  slug: "sea-cat/op18-003",
  name: "Sea Cat",
  printings: [
    {
      id: "OP18-003",
      artId: "OP18-003",
      setCode: "OP18",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-003.png",
      label: "Sea Cat (OP18-003)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Animal", "Alabasta"],
  attribute: "wisdom",
  i18n: localOp18SeaCat003I18n,
};
