// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Karoo004I18n } from "./op18-004-karoo.i18n.ts";

export const localOp18Karoo004: CharacterCard = {
  id: "OP18-004",
  canonicalId: "OP18-004",
  slug: "karoo/op18-004",
  name: "Karoo",
  printings: [
    {
      id: "OP18-004",
      artId: "OP18-004",
      setCode: "OP18",
      collectorNumber: "004",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-004.png",
      label: "Karoo (OP18-004)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP18",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  effect:
    "Apply each of the following effects based on this Character's power:\n• If it has 5000 power or more, this Character gains [Rush].\n• If it has 6000 power or more, this Character gains [Banish].\n• If it has 7000 power or more, this Character gains [Unblockable].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 5000,
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
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 6000,
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
            keyword: "banish",
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 7000,
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
            keyword: "unblockable",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: localOp18Karoo004I18n,
};
