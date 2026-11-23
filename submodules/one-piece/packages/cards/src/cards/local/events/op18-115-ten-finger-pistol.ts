// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18TenFingerPistol115I18n } from "./op18-115-ten-finger-pistol.i18n.ts";

export const localOp18TenFingerPistol115: EventCard = {
  id: "OP18-115",
  canonicalId: "OP18-115",
  slug: "ten-finger-pistol/op18-115",
  name: "Ten Finger Pistol",
  printings: [
    {
      id: "OP18-115",
      artId: "OP18-115",
      setCode: "OP18",
      collectorNumber: "115",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-115.png",
      label: "Ten Finger Pistol (OP18-115)",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP18",
  cost: 4,
  traits: ["CP9"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 5 or less.\n[Trigger] If your Leader's type includes \"CP\", draw 1 card and place up to 1 Character with a cost of 7 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
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
                  value: 7,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: localOp18TenFingerPistol115I18n,
};
