// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18KiwiMozu063I18n } from "./op18-063-kiwi-mozu.i18n.ts";

export const localOp18KiwiMozu063: CharacterCard = {
  id: "OP18-063",
  canonicalId: "OP18-063",
  slug: "kiwi-mozu/op18-063",
  name: "Kiwi & Mozu",
  printings: [
    {
      id: "OP18-063",
      artId: "OP18-063",
      setCode: "OP18",
      collectorNumber: "063",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-063.png",
      label: "Kiwi & Mozu (OP18-063)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP18",
  cost: 3,
  power: 1000,
  counter: 2000,
  traits: ["Water Seven", "The Franky Family"],
  attribute: "slash",
  effect:
    "[On Play] You may K.O. 1 of your Stages with a cost of 5 or less: Add up to 1 DON!! card as rested from your DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18KiwiMozu063I18n,
};
