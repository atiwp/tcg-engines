// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Stansen087I18n } from "./op18-087-stansen.i18n.ts";

export const localOp18Stansen087: CharacterCard = {
  id: "OP18-087",
  canonicalId: "OP18-087",
  slug: "stansen/op18-087",
  name: "Stansen",
  printings: [
    {
      id: "OP18-087",
      artId: "OP18-087",
      setCode: "OP18",
      collectorNumber: "087",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-087.png",
      label: "Stansen (OP18-087)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Giant", "Elbaph", "New Giant Pirates"],
  attribute: "strike",
  effect:
    "This Character gains +12 cost.\nIf you only have Characters with a cost of 12 or more, this Character gains +2000 power.",
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
      {
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "lt",
                value: 12,
              },
            ],
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: localOp18Stansen087I18n,
};
