// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Chaka008I18n } from "./op18-008-chaka.i18n.ts";

export const localOp18Chaka008: CharacterCard = {
  id: "OP18-008",
  canonicalId: "OP18-008",
  slug: "chaka/op18-008",
  name: "Chaka",
  printings: [
    {
      id: "OP18-008",
      artId: "OP18-008",
      setCode: "OP18",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-008.png",
      label: "Chaka (OP18-008)",
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
    "If your Leader has the {Alabasta} type, this Character gains [Rush].\n[On Play] You may trash 1 Character card with 5000 power or less from your hand: Draw 2 cards and this Character gains [Banish] during this turn.",
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
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Chaka008I18n,
};
