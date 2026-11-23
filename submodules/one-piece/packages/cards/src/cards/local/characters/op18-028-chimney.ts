// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Chimney028I18n } from "./op18-028-chimney.i18n.ts";

export const localOp18Chimney028: CharacterCard = {
  id: "OP18-028",
  canonicalId: "OP18-028",
  slug: "chimney/op18-028",
  name: "Chimney",
  printings: [
    {
      id: "OP18-028",
      artId: "OP18-028",
      setCode: "OP18",
      collectorNumber: "028",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-028.png",
      label: "Chimney (OP18-028)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP18",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Water Seven"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest 1 of your [Gonbe] and this Character: Set your [Monkey.D.Luffy] Leader as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "name",
                value: "Gonbe",
              },
            ],
          },
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Chimney028I18n,
};
