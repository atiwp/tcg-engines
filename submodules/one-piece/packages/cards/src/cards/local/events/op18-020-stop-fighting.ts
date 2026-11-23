// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18StopFighting020I18n } from "./op18-020-stop-fighting.i18n.ts";

export const localOp18StopFighting020: EventCard = {
  id: "OP18-020",
  canonicalId: "OP18-020",
  slug: "stop-fighting/op18-020",
  name: "Stop Fighting!!!",
  printings: [
    {
      id: "OP18-020",
      artId: "OP18-020",
      setCode: "OP18",
      collectorNumber: "020",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-020.png",
      label: "Stop Fighting!!! (OP18-020)",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP18",
  cost: 1,
  traits: ["Alabasta"],
  effect:
    "[Counter] You may add all of your Life cards to your hand: If your Leader is [Nefeltari Vivi], give your opponent's Leader and all of their Characters −5000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: "all",
            },
            destination: "hand",
          },
          {
            action: "conditional",
            predicate: {
              condition: "leaderName",
              name: "Nefeltari Vivi",
            },
            whenTrue: [
              {
                action: "modifyPower",
                target: {
                  player: "opponent",
                  zones: ["leader", "character"],
                  count: {
                    amount: "all",
                  },
                },
                value: -5000,
                duration: "thisTurn",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18StopFighting020I18n,
};
