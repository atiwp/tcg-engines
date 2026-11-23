// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Franky034I18n } from "./op18-034-franky.i18n.ts";

export const localOp18Franky034: CharacterCard = {
  id: "OP18-034",
  canonicalId: "OP18-034",
  slug: "franky/op18-034",
  name: "Franky",
  printings: [
    {
      id: "OP18-034",
      artId: "OP18-034",
      setCode: "OP18",
      collectorNumber: "034",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-034.png",
      label: "Franky (OP18-034)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP18",
  cost: 6,
  power: 7000,
  traits: ["Water Seven", "The Franky Family", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Play up to 1 {The Franky Family} or {Straw Hat Crew} type card with a cost of 5 or less from your hand. Then, if you have a Stage with a cost of 5 or more, rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "The Franky Family",
                    match: "exact",
                  },
                  {
                    filter: "trait",
                    value: "Straw Hat Crew",
                    match: "exact",
                  },
                ],
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
            ],
          },
          {
            action: "conditional",
            predicate: {
              condition: "existsOnField",
              player: "self",
              zone: "stage",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 5,
                },
              ],
            },
            whenTrue: [
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
                      filter: "cost",
                      comparison: "lte",
                      value: 6,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: localOp18Franky034I18n,
};
