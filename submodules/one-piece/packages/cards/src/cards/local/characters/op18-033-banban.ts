// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Banban033I18n } from "./op18-033-banban.i18n.ts";

export const localOp18Banban033: CharacterCard = {
  id: "OP18-033",
  canonicalId: "OP18-033",
  slug: "banban/op18-033",
  name: "Banban",
  printings: [
    {
      id: "OP18-033",
      artId: "OP18-033",
      setCode: "OP18",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-033.png",
      label: "Banban (OP18-033)",
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
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[End of Your Turn] You may trash this Character: Set up to 1 of your Characters as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Banban033I18n,
};
