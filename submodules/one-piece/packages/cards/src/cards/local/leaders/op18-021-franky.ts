// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localOp18Franky021I18n } from "./op18-021-franky.i18n.ts";

export const localOp18Franky021: LeaderCard = {
  id: "OP18-021",
  canonicalId: "OP18-021",
  slug: "franky/op18-021",
  name: "Franky",
  printings: [
    {
      id: "OP18-021",
      artId: "OP18-021",
      setCode: "OP18",
      collectorNumber: "021",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-021.png",
      label: "Franky (OP18-021)",
    },
  ],
  cardType: "leader",
  color: ["green", "purple"],
  rarity: "L",
  setId: "OP18",
  power: 5000,
  life: 4,
  traits: ["Water Seven", "The Franky Family", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "All Stage cards in your hand have a +3000 Counter.\n[Activate: Main] [Once Per Turn] DON!! −1: Play up to 1 Stage card with a cost of 5 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
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
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18Franky021I18n,
};
