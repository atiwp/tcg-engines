// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Shirahoshi014I18n } from "./eb05-014-shirahoshi.i18n.ts";

export const localEb05Shirahoshi014: CharacterCard = {
  id: "EB05-014",
  canonicalId: "EB05-014",
  slug: "shirahoshi/eb05-014",
  name: "Shirahoshi",
  printings: [
    {
      id: "EB05-014",
      artId: "EB05-014",
      setCode: "EB05",
      collectorNumber: "014",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-014.jpg",
      label: "Shirahoshi (EB05-014)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "EB05",
  cost: 1,
  power: 0,
  traits: ["Merfolk", "Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to a total of 2 [Megalo] or {Neptunian} type cards and add them to your hand. Then, trash the rest.\n[Activate: Main] You may rest this Character: Up to 1 of your {Neptunian} type Characters with 6000 power or less gains [Rush] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Megalo",
                  },
                  {
                    filter: "trait",
                    value: "Neptunian",
                    match: "exact",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
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
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Neptunian",
                  match: "exact",
                },
                {
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localEb05Shirahoshi014I18n,
};
