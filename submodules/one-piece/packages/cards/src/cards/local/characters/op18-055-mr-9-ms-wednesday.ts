// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr9MsWednesday055I18n } from "./op18-055-mr-9-ms-wednesday.i18n.ts";

export const localOp18Mr9MsWednesday055: CharacterCard = {
  id: "OP18-055",
  canonicalId: "OP18-055",
  slug: "mr-9-ms-wednesday/op18-055",
  name: "Mr.9 & Ms. Wednesday",
  printings: [
    {
      id: "OP18-055",
      artId: "OP18-055",
      setCode: "OP18",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-055.png",
      label: "Mr.9 & Ms. Wednesday (OP18-055)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: ["slash", "strike"],
  effect:
    "[DON!! x1] This Character gains +1000 power.\n[On Play] Return up to 1 of your opponent's Characters with a cost of 2 or less to the owner's hand.",
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
        actions: [
          {
            action: "returnToHand",
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
  i18n: localOp18Mr9MsWednesday055I18n,
};
