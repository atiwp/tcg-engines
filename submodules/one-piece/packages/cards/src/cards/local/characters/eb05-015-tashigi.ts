// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. No effect text from the source: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Tashigi015I18n } from "./eb05-015-tashigi.i18n.ts";

export const localEb05Tashigi015: CharacterCard = {
  id: "EB05-015",
  canonicalId: "EB05-015",
  slug: "tashigi/eb05-015",
  name: "Tashigi",
  printings: [
    {
      id: "EB05-015",
      artId: "EB05-015",
      setCode: "EB05",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-015.jpg",
      label: "Tashigi (EB05-015)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB05",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Navy", "East Blue"],
  attribute: "slash",
  i18n: localEb05Tashigi015I18n,
};
