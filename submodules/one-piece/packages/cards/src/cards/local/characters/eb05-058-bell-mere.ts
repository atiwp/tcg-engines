// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. No effect text from the source: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05BellMere058I18n } from "./eb05-058-bell-mere.i18n.ts";

export const localEb05BellMere058: CharacterCard = {
  id: "EB05-058",
  canonicalId: "EB05-058",
  slug: "bell-mere/eb05-058",
  name: "Bell-mere",
  printings: [
    {
      id: "EB05-058",
      artId: "EB05-058",
      setCode: "EB05",
      collectorNumber: "058",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-058.jpg",
      label: "Bell-mere (EB05-058)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB05",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Former Navy", "East Blue"],
  attribute: "ranged",
  i18n: localEb05BellMere058I18n,
};
