// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Wanze114I18n } from "./op18-114-wanze.i18n.ts";

export const localOp18Wanze114: CharacterCard = {
  id: "OP18-114",
  canonicalId: "OP18-114",
  slug: "wanze/op18-114",
  name: "Wanze",
  printings: [
    {
      id: "OP18-114",
      artId: "OP18-114",
      setCode: "OP18",
      collectorNumber: "114",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-114.png",
      label: "Wanze (OP18-114)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  traits: ["CP7"],
  attribute: "slash",
  effect:
    "[On Play] Look at all of your Life cards and place them back in your Life area in any order.\n[Trigger] If your Leader's type includes \"CP\", place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeLife",
            player: "self",
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "CP",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
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
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: localOp18Wanze114I18n,
};
