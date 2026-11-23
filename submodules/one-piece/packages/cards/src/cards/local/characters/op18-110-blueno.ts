// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Blueno110I18n } from "./op18-110-blueno.i18n.ts";

export const localOp18Blueno110: CharacterCard = {
  id: "OP18-110",
  canonicalId: "OP18-110",
  slug: "blueno/op18-110",
  name: "Blueno",
  printings: [
    {
      id: "OP18-110",
      artId: "OP18-110",
      setCode: "OP18",
      collectorNumber: "110",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-110.png",
      label: "Blueno (OP18-110)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP18",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "strike",
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 card with a type including "CP" other than [Blueno] and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[Trigger] Draw 1 card and K.O. up to 1 of your opponent\'s Characters with a cost of 2 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "CP",
                match: "includes",
              },
              {
                filter: "excludeName",
                value: "Blueno",
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
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18Blueno110I18n,
};
