// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Doll002I18n } from "./eb05-002-doll.i18n.ts";

export const localEb05Doll002: CharacterCard = {
  id: "EB05-002",
  canonicalId: "EB05-002",
  slug: "doll/eb05-002",
  name: "Doll",
  printings: [
    {
      id: "EB05-002",
      artId: "EB05-002",
      setCode: "EB05",
      collectorNumber: "002",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-002.jpg",
      label: "Doll (EB05-002)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 2 {Navy} type cards with a cost of 2 or more and add them to your hand, then place the rest at the bottom of your deck in any order. Then, trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Navy",
                match: "exact",
              },
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: localEb05Doll002I18n,
};
