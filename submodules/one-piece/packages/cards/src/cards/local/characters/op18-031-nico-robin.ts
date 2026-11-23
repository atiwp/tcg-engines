// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18NicoRobin031I18n } from "./op18-031-nico-robin.i18n.ts";

export const localOp18NicoRobin031: CharacterCard = {
  id: "OP18-031",
  canonicalId: "OP18-031",
  slug: "nico-robin/op18-031",
  name: "Nico Robin",
  printings: [
    {
      id: "OP18-031",
      artId: "OP18-031",
      setCode: "OP18",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-031.png",
      label: "Nico Robin (OP18-031)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP18",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Water Seven", "Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[Opponent's Turn] If your Character would be removed from the field by your opponent's effect, you may rest this Character instead.\n[End of Your Turn] Set up to 1 of your {Water Seven} type cards and up to 1 of your DON!! cards as active.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
        },
        source: "opponentEffect",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            self: true,
          },
        },
      },
    ],
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader", "character", "stage"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Water Seven",
                  match: "exact",
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18NicoRobin031I18n,
};
