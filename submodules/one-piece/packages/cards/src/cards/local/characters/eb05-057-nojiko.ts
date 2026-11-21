// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Nojiko057I18n } from "./eb05-057-nojiko.i18n.ts";

export const localEb05Nojiko057: CharacterCard = {
  id: "EB05-057",
  canonicalId: "EB05-057",
  slug: "nojiko/eb05-057",
  name: "Nojiko",
  printings: [
    {
      id: "EB05-057",
      artId: "EB05-057",
      setCode: "EB05",
      collectorNumber: "057",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-057.jpg",
      label: "Nojiko (EB05-057)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB05",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    '[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your Leader or Character cards with the "Special" or "Wisdom" Attribute.\n[Trigger] If your have 2 or less Life cards, play up to 1 Character card with 6000 power or less and a [Trigger] from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "attribute",
                      value: "special",
                    },
                    {
                      filter: "attribute",
                      value: "wisdom",
                    },
                  ],
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
                value: "character",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: localEb05Nojiko057I18n,
};
