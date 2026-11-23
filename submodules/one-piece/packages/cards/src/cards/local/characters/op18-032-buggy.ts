// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Buggy032I18n } from "./op18-032-buggy.i18n.ts";

export const localOp18Buggy032: CharacterCard = {
  id: "OP18-032",
  canonicalId: "OP18-032",
  slug: "buggy/op18-032",
  name: "Buggy",
  printings: [
    {
      id: "OP18-032",
      artId: "OP18-032",
      setCode: "OP18",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-032.png",
      label: "Buggy (OP18-032)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["East Blue", "Buggy Pirates"],
  attribute: "slash",
  effect:
    "[On Play]/[On K.O.] Up to 1 of your opponent's rested Characters with 8000 power or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "power",
                  comparison: "lte",
                  value: 8000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "power",
                  comparison: "lte",
                  value: 8000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18Buggy032I18n,
};
