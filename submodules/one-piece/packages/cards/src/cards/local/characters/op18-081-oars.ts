// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Oars081I18n } from "./op18-081-oars.i18n.ts";

export const localOp18Oars081: CharacterCard = {
  id: "OP18-081",
  canonicalId: "OP18-081",
  slug: "oars/op18-081",
  name: "Oars",
  printings: [
    {
      id: "OP18-081",
      artId: "OP18-081",
      setCode: "OP18",
      collectorNumber: "081",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-081.png",
      label: "Oars (OP18-081)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP18",
  cost: 10,
  power: 11000,
  traits: ["Giant", "Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "If you have a [Gecko Moria] Character, this Character gains [Double Attack] and [Blocker].\n[Trigger] Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "name",
                value: "Gecko Moria",
              },
            ],
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
            keyword: "doubleAttack",
            duration: "permanent",
          },
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
        ],
      },
    ],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
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
                value: "Thriller Bark Pirates",
                match: "exact",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: localOp18Oars081I18n,
};
