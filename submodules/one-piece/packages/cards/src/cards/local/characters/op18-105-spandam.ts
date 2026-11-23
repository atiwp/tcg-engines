// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Spandam105I18n } from "./op18-105-spandam.i18n.ts";

export const localOp18Spandam105: CharacterCard = {
  id: "OP18-105",
  canonicalId: "OP18-105",
  slug: "spandam/op18-105",
  name: "Spandam",
  printings: [
    {
      id: "OP18-105",
      artId: "OP18-105",
      setCode: "OP18",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-105.png",
      label: "Spandam (OP18-105)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP18",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["CP9"],
  attribute: "slash",
  effect:
    '[Trigger] If your Leader\'s type includes "CP", reveal up to 1 card with a type including "CP" other than [Spandam] from your hand. Activate the [Trigger] effect of the revealed card.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "CP",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "trigger",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "CP",
                  match: "includes",
                },
                {
                  filter: "excludeName",
                  value: "Spandam",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18Spandam105I18n,
};
