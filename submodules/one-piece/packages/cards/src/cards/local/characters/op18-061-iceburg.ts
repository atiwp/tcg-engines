// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Iceburg061I18n } from "./op18-061-iceburg.i18n.ts";

export const localOp18Iceburg061: CharacterCard = {
  id: "OP18-061",
  canonicalId: "OP18-061",
  slug: "iceburg/op18-061",
  name: "Iceburg",
  printings: [
    {
      id: "OP18-061",
      artId: "OP18-061",
      setCode: "OP18",
      collectorNumber: "061",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-061.png",
      label: "Iceburg (OP18-061)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP18",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Water Seven", "Galley-La Company"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to a total of 2 Stage cards or {Water Seven} type cards and add them to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "cardCategory",
                    value: "stage",
                  },
                  {
                    filter: "trait",
                    value: "Water Seven",
                    match: "exact",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: localOp18Iceburg061I18n,
};
