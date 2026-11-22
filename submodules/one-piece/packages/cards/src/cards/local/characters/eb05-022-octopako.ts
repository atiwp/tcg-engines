// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Octopako022I18n } from "./eb05-022-octopako.i18n.ts";

export const localEb05Octopako022: CharacterCard = {
  id: "EB05-022",
  canonicalId: "EB05-022",
  slug: "octopako/eb05-022",
  name: "Octopako",
  printings: [
    {
      id: "EB05-022",
      artId: "EB05-022",
      setCode: "EB05",
      collectorNumber: "022",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-022.jpg",
      label: "Octopako (EB05-022)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Fish-Man", "Fish-Man Island"],
  attribute: "wisdom",
  effect: "[On K.O.] Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: localEb05Octopako022I18n,
};
