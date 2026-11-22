// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05TakeCareEverybody030I18n } from "./eb05-030-take-care-everybody.i18n.ts";

export const localEb05TakeCareEverybody030: EventCard = {
  id: "EB05-030",
  canonicalId: "EB05-030",
  slug: "take-care-everybody/eb05-030",
  name: "Take Care, Everybody.",
  printings: [
    {
      id: "EB05-030",
      artId: "EB05-030",
      setCode: "EB05",
      collectorNumber: "030",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-030.jpg",
      label: "Take Care, Everybody. (EB05-030)",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "EB05",
  cost: 2,
  traits: ["Straw Hat Crew", "East Blue"],
  effect:
    "[Main] If your Leader is [Nami], return up to 1 Character with a cost of 5 or less to the owner's hand. [Counter] Draw 1 card, and up to 1 of your Leader or Characters gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Nami",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: localEb05TakeCareEverybody030I18n,
};
