// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Kaku099I18n } from "./op18-099-kaku.i18n.ts";

export const localOp18Kaku099: CharacterCard = {
  id: "OP18-099",
  canonicalId: "OP18-099",
  slug: "kaku/op18-099",
  name: "Kaku",
  printings: [
    {
      id: "OP18-099",
      artId: "OP18-099",
      setCode: "OP18",
      collectorNumber: "099",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-099.png",
      label: "Kaku (OP18-099)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP18",
  cost: 7,
  power: 9000,
  traits: ["CP9"],
  attribute: "slash",
  effect:
    '[On Play] Add up to 1 card with a type including "CP" from your hand to the top or bottom of your Life cards face-up.\n[Trigger] If your Leader\'s type includes "CP", draw 1 card and place up to 1 Character with a cost of 8 or less at the bottom of the owner\'s deck.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
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
              ],
            },
            position: "choice",
            faceUp: true,
          },
        ],
      },
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
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "returnToDeck",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: localOp18Kaku099I18n,
};
