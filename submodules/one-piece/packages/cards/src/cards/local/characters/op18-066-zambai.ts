// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Zambai066I18n } from "./op18-066-zambai.i18n.ts";

export const localOp18Zambai066: CharacterCard = {
  id: "OP18-066",
  canonicalId: "OP18-066",
  slug: "zambai/op18-066",
  name: "Zambai",
  printings: [
    {
      id: "OP18-066",
      artId: "OP18-066",
      setCode: "OP18",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-066.png",
      label: "Zambai (OP18-066)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Water Seven", "The Franky Family"],
  attribute: "slash",
  effect:
    "[Activate: Main] You may K.O. 1 of your Stages with a cost of 5 or less: This Character gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)",
  effects: {
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
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Zambai066I18n,
};
