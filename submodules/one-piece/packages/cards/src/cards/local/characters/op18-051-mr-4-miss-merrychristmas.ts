// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr4MissMerrychristmas051I18n } from "./op18-051-mr-4-miss-merrychristmas.i18n.ts";

export const localOp18Mr4MissMerrychristmas051: CharacterCard = {
  id: "OP18-051",
  canonicalId: "OP18-051",
  slug: "mr-4-miss-merrychristmas/op18-051",
  name: "Mr.4 & Miss.MerryChristmas",
  printings: [
    {
      id: "OP18-051",
      artId: "OP18-051",
      setCode: "OP18",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-051.png",
      label: "Mr.4 & Miss.MerryChristmas (OP18-051)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP18",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: ["slash", "strike"],
  effect:
    "[DON!! x1] This Character gains +1000 power.\n[On Play] You may rest 5 of your DON!! cards: Place up to 1 Character with a cost of 6 or less and up to 1 Character with a cost of 5 or less at the bottom of the owner's deck in any order of the owner's choosing.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 5,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            targetGroups: [
              {
                player: "any",
                zones: ["character"],
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "cost",
                    comparison: "lte",
                    value: 6,
                  },
                ],
              },
              {
                player: "any",
                zones: ["character"],
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "cost",
                    comparison: "lte",
                    value: 5,
                  },
                ],
              },
            ],
            position: "bottom",
            order: "any",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Mr4MissMerrychristmas051I18n,
};
