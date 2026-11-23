// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Funkfreed108I18n } from "./op18-108-funkfreed.i18n.ts";

export const localOp18Funkfreed108: CharacterCard = {
  id: "OP18-108",
  canonicalId: "OP18-108",
  slug: "funkfreed/op18-108",
  name: "Funkfreed",
  printings: [
    {
      id: "OP18-108",
      artId: "OP18-108",
      setCode: "OP18",
      collectorNumber: "108",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-108.png",
      label: "Funkfreed (OP18-108)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP18",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["CP9"],
  attribute: "slash",
  effect:
    '[On Play] You may trash 1 card with a type including "CP" from your hand: Draw 2 cards.\n[Activate: Main] You may rest this Character: Up to 1 of your [Spandam] gains +1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "CP",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Spandam",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Funkfreed108I18n,
};
