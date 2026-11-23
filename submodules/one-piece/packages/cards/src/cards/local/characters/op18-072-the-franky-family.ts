// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18TheFrankyFamily072I18n } from "./op18-072-the-franky-family.i18n.ts";

export const localOp18TheFrankyFamily072: CharacterCard = {
  id: "OP18-072",
  canonicalId: "OP18-072",
  slug: "the-franky-family/op18-072",
  name: "The Franky Family",
  printings: [
    {
      id: "OP18-072",
      artId: "OP18-072",
      setCode: "OP18",
      collectorNumber: "072",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-072.png",
      label: "The Franky Family (OP18-072)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Water Seven", "The Franky Family"],
  attribute: "slash",
  effect:
    "[Blocker]\n[Activate: Main] [Once Per Turn] You may K.O. 1 of your Stages with a cost of 5 or less: If this Character was played on this turn, give up to 1 of your opponent's Characters −3000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashCard",
            amount: 1,
            options: [
              {
                zones: ["stage"],
                filters: [
                  {
                    filter: "cardCategory",
                    value: "stage",
                  },
                  {
                    filter: "cost",
                    comparison: "lte",
                    value: 5,
                  },
                ],
              },
            ],
          },
        ],
        postCostConditions: [
          {
            condition: "playedThisTurn",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18TheFrankyFamily072I18n,
};
