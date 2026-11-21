// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Nami055I18n } from "./eb05-055-nami.i18n.ts";

export const localEb05Nami055: CharacterCard = {
  id: "EB05-055",
  canonicalId: "EB05-055",
  slug: "nami/eb05-055",
  name: "Nami",
  printings: [
    {
      id: "EB05-055",
      artId: "EB05-055",
      setCode: "EB05",
      collectorNumber: "055",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-055.jpg",
      label: "Nami (EB05-055)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB05",
  cost: 5,
  power: 6000,
  traits: ["Straw Hat Crew", "East Blue"],
  attribute: "wisdom",
  effect:
    '[Your Turn] [On Play] If your Leader has the "Wisdom" attribute, add up to 1 card from the top of your deck to the top of your Life cards.\n[Trigger] You may trash 1 card from your hand: If you have 2 or less Life cards, play this card.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "leaderAttribute",
            attribute: "wisdom",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localEb05Nami055I18n,
};
