// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. No effect text from the source: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Ulti032I18n } from "./eb05-032-ulti.i18n.ts";

export const localEb05Ulti032: CharacterCard = {
  id: "EB05-032",
  canonicalId: "EB05-032",
  slug: "ulti/eb05-032",
  name: "Ulti",
  printings: [
    {
      id: "EB05-032",
      artId: "EB05-032",
      setCode: "EB05",
      collectorNumber: "032",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-032.jpg",
      label: "Ulti (EB05-032)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB05",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  i18n: localEb05Ulti032I18n,
};
