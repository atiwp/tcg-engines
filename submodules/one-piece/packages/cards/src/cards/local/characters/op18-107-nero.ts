// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Nero107I18n } from "./op18-107-nero.i18n.ts";

export const localOp18Nero107: CharacterCard = {
  id: "OP18-107",
  canonicalId: "OP18-107",
  slug: "nero/op18-107",
  name: "Nero",
  printings: [
    {
      id: "OP18-107",
      artId: "OP18-107",
      setCode: "OP18",
      collectorNumber: "107",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-107.png",
      label: "Nero (OP18-107)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP18",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "ranged",
  effect:
    "[Blocker]\n[Trigger] If your Leader's type includes \"CP\", place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
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
  i18n: localOp18Nero107I18n,
};
