// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Nami030I18n } from "./op18-030-nami.i18n.ts";

export const localOp18Nami030: CharacterCard = {
  id: "OP18-030",
  canonicalId: "OP18-030",
  slug: "nami/op18-030",
  name: "Nami",
  printings: [
    {
      id: "OP18-030",
      artId: "OP18-030",
      setCode: "OP18",
      collectorNumber: "030",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-030.png",
      label: "Nami (OP18-030)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP18",
  cost: 4,
  power: 6000,
  counter: 2000,
  traits: ["Water Seven", "Straw Hat Crew"],
  attribute: "wisdom",
  effect: "[Opponent's Turn] If this Character is rested, give this Character −2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "cardState",
            target: "this",
            property: "state",
            comparison: "eq",
            value: "rested",
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
            value: -2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: localOp18Nami030I18n,
};
