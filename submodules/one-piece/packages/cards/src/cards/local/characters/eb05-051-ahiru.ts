// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Ahiru051I18n } from "./eb05-051-ahiru.i18n.ts";

export const localEb05Ahiru051: CharacterCard = {
  id: "EB05-051",
  canonicalId: "EB05-051",
  slug: "ahiru/eb05-051",
  name: "Ahiru",
  printings: [
    {
      id: "EB05-051",
      artId: "EB05-051",
      setCode: "EB05",
      collectorNumber: "051",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-051.jpg",
      label: "Ahiru (EB05-051)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "ranged",
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards.\n[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "totalLifeCount",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: localEb05Ahiru051I18n,
};
