// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18NefeltariVivi011I18n } from "./op18-011-nefeltari-vivi.i18n.ts";

export const localOp18NefeltariVivi011: CharacterCard = {
  id: "OP18-011",
  canonicalId: "OP18-011",
  slug: "nefeltari-vivi/op18-011",
  name: "Nefeltari Vivi",
  printings: [
    {
      id: "OP18-011",
      artId: "OP18-011",
      setCode: "OP18",
      collectorNumber: "011",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-011.png",
      label: "Nefeltari Vivi (OP18-011)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP18",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "All of your Characters with both the {Animal} and {Alabasta} types gain +1000 power.\n[Opponent's Turn] This Character gains [Blocker] and +6000 power.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Animal",
                  match: "exact",
                },
                {
                  filter: "trait",
                  value: "Alabasta",
                  match: "exact",
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 6000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: localOp18NefeltariVivi011I18n,
};
