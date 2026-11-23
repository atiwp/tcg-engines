// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18CanYouPleaseSailOnThe074I18n } from "./op18-074-can-you-please-sail-on-the.i18n.ts";

export const localOp18CanYouPleaseSailOnThe074: EventCard = {
  id: "OP18-074",
  canonicalId: "OP18-074",
  slug: "can-you-please-sail-on-the/op18-074",
  name: "Can You Please Sail on the Ship I Made?!",
  printings: [
    {
      id: "OP18-074",
      artId: "OP18-074",
      setCode: "OP18",
      collectorNumber: "074",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-074.png",
      label: "Can You Please Sail on the Ship I Made?! (OP18-074)",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP18",
  cost: 1,
  traits: ["Water Seven", "The Franky Family"],
  effect:
    "[Counter] If you have a Stage with a cost of 5 or more, up to 1 of your Leader or Characters gains +4000 power during this battle.\n[Trigger] DON!! −1: Add up to 2 Stage cards from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "existsOnField",
            player: "self",
            zone: "stage",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "stage",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18CanYouPleaseSailOnThe074I18n,
};
