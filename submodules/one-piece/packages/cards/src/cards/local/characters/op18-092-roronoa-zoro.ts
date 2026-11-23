// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18RoronoaZoro092I18n } from "./op18-092-roronoa-zoro.i18n.ts";

export const localOp18RoronoaZoro092: CharacterCard = {
  id: "OP18-092",
  canonicalId: "OP18-092",
  slug: "roronoa-zoro/op18-092",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP18-092",
      artId: "OP18-092",
      setCode: "OP18",
      collectorNumber: "092",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-092.png",
      label: "Roronoa Zoro (OP18-092)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP18",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Elbaph", "Straw Hat Crew"],
  attribute: "slash",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains +3000 power.\nIf you have 10 or more cards in your trash, this Character gains [Rush].\n(This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 10,
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
    ],
  },
  i18n: localOp18RoronoaZoro092I18n,
};
