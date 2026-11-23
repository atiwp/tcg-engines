// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Igaram002I18n } from "./op18-002-igaram.i18n.ts";

export const localOp18Igaram002: CharacterCard = {
  id: "OP18-002",
  canonicalId: "OP18-002",
  slug: "igaram/op18-002",
  name: "Igaram",
  printings: [
    {
      id: "OP18-002",
      artId: "OP18-002",
      setCode: "OP18",
      collectorNumber: "002",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-002.png",
      label: "Igaram (OP18-002)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP18",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "ranged",
  effect: "[On Play] You may trash 1 {Alabasta} type card from your hand: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Alabasta",
                match: "exact",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Igaram002I18n,
};
