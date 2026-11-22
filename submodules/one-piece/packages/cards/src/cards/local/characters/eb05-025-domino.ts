// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Domino025I18n } from "./eb05-025-domino.i18n.ts";

export const localEb05Domino025: CharacterCard = {
  id: "EB05-025",
  canonicalId: "EB05-025",
  slug: "domino/eb05-025",
  name: "Domino",
  printings: [
    {
      id: "EB05-025",
      artId: "EB05-025",
      setCode: "EB05",
      collectorNumber: "025",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-025.jpg",
      label: "Domino (EB05-025)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB05",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Impel Down} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[Trigger] Activate this card's [On Play] effect.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Impel Down",
                match: "exact",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "onPlay",
          },
        ],
      },
    ],
  },
  i18n: localEb05Domino025I18n,
};
