// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Brogy091I18n } from "./op18-091-brogy.i18n.ts";

export const localOp18Brogy091: CharacterCard = {
  id: "OP18-091",
  canonicalId: "OP18-091",
  slug: "brogy/op18-091",
  name: "Brogy",
  printings: [
    {
      id: "OP18-091",
      artId: "OP18-091",
      setCode: "OP18",
      collectorNumber: "091",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-091.png",
      label: "Brogy (OP18-091)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP18",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Giant", "Elbaph", "Giant Pirates"],
  attribute: "slash",
  effect:
    "This Character gains +12 cost.\n[When Attacking] You may trash 1 card from your hand: Add up to 1 of your Character cards with a cost of 2 or less from your trash to your hand.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 12,
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Brogy091I18n,
};
