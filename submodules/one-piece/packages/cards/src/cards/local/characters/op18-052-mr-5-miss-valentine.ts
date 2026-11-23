// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr5MissValentine052I18n } from "./op18-052-mr-5-miss-valentine.i18n.ts";

export const localOp18Mr5MissValentine052: CharacterCard = {
  id: "OP18-052",
  canonicalId: "OP18-052",
  slug: "mr-5-miss-valentine/op18-052",
  name: "Mr.5 & Miss.Valentine",
  printings: [
    {
      id: "OP18-052",
      artId: "OP18-052",
      setCode: "OP18",
      collectorNumber: "052",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-052.png",
      label: "Mr.5 & Miss.Valentine (OP18-052)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP18",
  cost: 5,
  power: 4000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: ["strike", "special"],
  effect:
    '[DON!! x1] This Character gains +1000 power.\n[On Play] Play up to 1 Character card with a type including "Baroque Works" and a cost of 3 or less from your hand.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
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
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
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
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: localOp18Mr5MissValentine052I18n,
};
