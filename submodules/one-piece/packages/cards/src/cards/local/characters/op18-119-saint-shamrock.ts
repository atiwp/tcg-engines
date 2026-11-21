// OP Practice local card (fork-only). Source: oplaytcg.com text typed by the user, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18SaintShamrock119I18n } from "./op18-119-saint-shamrock.i18n.ts";

export const localOp18SaintShamrock119: CharacterCard = {
  id: "OP18-119",
  canonicalId: "OP18-119",
  slug: "saint-shamrock/op18-119",
  name: "Saint Shamrock",
  printings: [
    {
      id: "OP18-119",
      artId: "OP18-119",
      setCode: "OP18",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-119.png",
      label: "Saint Shamrock (OP18-119)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP18",
  cost: 8,
  power: 9000,
  traits: ["Celestial Dragons", "Holy Knights of God"],
  attribute: "slash",
  effect:
    "[On K.O.] You may trash 1 card from your hand: Play this Character card from your trash.\n[Activate: Main] [Once Per Turn] If this Character was played on this turn, play up to 1 Holy Knights of God type Character card with a cost of 6 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            self: true,
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playedThisTurn",
          },
        ],
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
                value: "Holy Knights of God",
                match: "exact",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18SaintShamrock119I18n,
};
