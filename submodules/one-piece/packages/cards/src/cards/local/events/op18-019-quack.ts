// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18Quack019I18n } from "./op18-019-quack.i18n.ts";

export const localOp18Quack019: EventCard = {
  id: "OP18-019",
  canonicalId: "OP18-019",
  slug: "quack/op18-019",
  name: "Quack!!!",
  printings: [
    {
      id: "OP18-019",
      artId: "OP18-019",
      setCode: "OP18",
      collectorNumber: "019",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-019.png",
      label: "Quack!!! (OP18-019)",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP18",
  cost: 1,
  traits: ["Animal", "Alabasta"],
  effect:
    "[Main] If you have no Characters with 7000 base power or more, give up to 1 of your opponent's Characters −3000 power during this turn.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "basePower",
                comparison: "gte",
                value: 7000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: localOp18Quack019I18n,
};
