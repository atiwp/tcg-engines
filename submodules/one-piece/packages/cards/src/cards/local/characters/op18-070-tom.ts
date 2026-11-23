// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Tom070I18n } from "./op18-070-tom.i18n.ts";

export const localOp18Tom070: CharacterCard = {
  id: "OP18-070",
  canonicalId: "OP18-070",
  slug: "tom/op18-070",
  name: "Tom",
  printings: [
    {
      id: "OP18-070",
      artId: "OP18-070",
      setCode: "OP18",
      collectorNumber: "070",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-070.png",
      label: "Tom (OP18-070)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP18",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Fish-Man", "Water Seven"],
  attribute: "wisdom",
  effect:
    "[On Play] DON!! −1, you may trash 1 card from your hand: Add up to 2 Stage cards from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
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
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "stage",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Tom070I18n,
};
