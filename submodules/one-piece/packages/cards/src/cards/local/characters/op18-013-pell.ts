// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Pell013I18n } from "./op18-013-pell.i18n.ts";

export const localOp18Pell013: CharacterCard = {
  id: "OP18-013",
  canonicalId: "OP18-013",
  slug: "pell/op18-013",
  name: "Pell",
  printings: [
    {
      id: "OP18-013",
      artId: "OP18-013",
      setCode: "OP18",
      collectorNumber: "013",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-013.png",
      label: "Pell (OP18-013)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "If your Leader has the {Alabasta} type, this Character gains [Rush].\n[On Play] You may trash 1 Character card with 5000 power or less from your hand: Draw 2 cards and trash up to 1 of your opponent's Characters with 3000 base power or less.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Alabasta",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
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
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromField",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Pell013I18n,
};
