// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. No effect text from the source: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Pasia003I18n } from "./eb05-003-pasia.i18n.ts";

export const localEb05Pasia003: CharacterCard = {
  id: "EB05-003",
  canonicalId: "EB05-003",
  slug: "pasia/eb05-003",
  name: "Pasia",
  printings: [
    {
      id: "EB05-003",
      artId: "EB05-003",
      setCode: "EB05",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-003.jpg",
      label: "Pasia (EB05-003)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB05",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Sabaody Archipelago"],
  attribute: "wisdom",
  i18n: localEb05Pasia003I18n,
};
