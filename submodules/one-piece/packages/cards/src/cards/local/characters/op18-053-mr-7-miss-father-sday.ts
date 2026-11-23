// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr7MissFatherSday053I18n } from "./op18-053-mr-7-miss-father-sday.i18n.ts";

export const localOp18Mr7MissFatherSday053: CharacterCard = {
  id: "OP18-053",
  canonicalId: "OP18-053",
  slug: "mr-7-miss-father-sday/op18-053",
  name: "Mr.7 & Miss.Father'sDay",
  printings: [
    {
      id: "OP18-053",
      artId: "OP18-053",
      setCode: "OP18",
      collectorNumber: "053",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-053.png",
      label: "Mr.7 & Miss.Father'sDay (OP18-053)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP18",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "ranged",
  effect:
    "[DON!! x1] This Character gains +1000 power.\n[On Play] Look at 3 cards from the top of your deck, reorganize them in any order and place them at the top or bottom of your deck.",
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
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: localOp18Mr7MissFatherSday053I18n,
};
