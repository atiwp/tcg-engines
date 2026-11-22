// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05BeloBetty005I18n } from "./eb05-005-belo-betty.i18n.ts";

export const localEb05BeloBetty005: CharacterCard = {
  id: "EB05-005",
  canonicalId: "EB05-005",
  slug: "belo-betty/eb05-005",
  name: "Belo Betty",
  printings: [
    {
      id: "EB05-005",
      artId: "EB05-005",
      setCode: "EB05",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-005.jpg",
      label: "Belo Betty (EB05-005)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB05",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] Up to 3 of your Characters with both the {Revolutionary Army} type and a [Trigger] gain +2000 power during this turn.\n[Activate: Main] You may trash this Character: Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                  match: "exact",
                },
                {
                  filter: "hasTrigger",
                  value: true,
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localEb05BeloBetty005I18n,
};
