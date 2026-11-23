// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18MonkeyDLuffy118I18n } from "./op18-118-monkey-d-luffy.i18n.ts";

export const localOp18MonkeyDLuffy118: CharacterCard = {
  id: "OP18-118",
  canonicalId: "OP18-118",
  slug: "monkey-d-luffy/op18-118",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP18-118",
      artId: "OP18-118",
      setCode: "OP18",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-118.png",
      label: "Monkey.D.Luffy (OP18-118)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP18",
  cost: 9,
  power: 10000,
  traits: ["Water Seven", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Set up to 3 of your DON!! cards as active. Then, up to 1 of your opponent's Characters cannot be rested until the end of your opponent's next End Phase.\n[End of Your Turn] Set up to 1 of your {Water Seven} type cards as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 3,
                upTo: true,
              },
            },
          },
          {
            action: "cannotBeRested",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
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
        ],
      },
    ],
  },
  i18n: localOp18MonkeyDLuffy118I18n,
};
