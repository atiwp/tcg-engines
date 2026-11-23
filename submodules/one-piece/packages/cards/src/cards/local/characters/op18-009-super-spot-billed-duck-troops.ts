// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18SuperSpotBilledDuckTroops009I18n } from "./op18-009-super-spot-billed-duck-troops.i18n.ts";

export const localOp18SuperSpotBilledDuckTroops009: CharacterCard = {
  id: "OP18-009",
  canonicalId: "OP18-009",
  slug: "super-spot-billed-duck-troops/op18-009",
  name: "Super Spot-Billed Duck Troops",
  printings: [
    {
      id: "OP18-009",
      artId: "OP18-009",
      setCode: "OP18",
      collectorNumber: "009",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-009.png",
      label: "Super Spot-Billed Duck Troops (OP18-009)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP18",
  cost: 4,
  power: 5000,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)\n[Activate: Main] You may trash this Character: If you have 9 or more DON!! cards on your field, play up to 1 [Karoo] from your hand.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        postCostConditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 9,
          },
        ],
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
                filter: "name",
                value: "Karoo",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18SuperSpotBilledDuckTroops009I18n,
};
