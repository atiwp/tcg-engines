// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Gonbe025I18n } from "./op18-025-gonbe.i18n.ts";

export const localOp18Gonbe025: CharacterCard = {
  id: "OP18-025",
  canonicalId: "OP18-025",
  slug: "gonbe/op18-025",
  name: "Gonbe",
  printings: [
    {
      id: "OP18-025",
      artId: "OP18-025",
      setCode: "OP18",
      collectorNumber: "025",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-025.png",
      label: "Gonbe (OP18-025)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP18",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Animal", "Water Seven"],
  attribute: "wisdom",
  effect: "[End of Your Turn] If this Character is rested, set your Leader as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
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
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18Gonbe025I18n,
};
