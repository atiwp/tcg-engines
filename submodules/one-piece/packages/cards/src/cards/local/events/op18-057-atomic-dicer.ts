// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18AtomicDicer057I18n } from "./op18-057-atomic-dicer.i18n.ts";

export const localOp18AtomicDicer057: EventCard = {
  id: "OP18-057",
  canonicalId: "OP18-057",
  slug: "atomic-dicer/op18-057",
  name: "Atomic Dicer",
  printings: [
    {
      id: "OP18-057",
      artId: "OP18-057",
      setCode: "OP18",
      collectorNumber: "057",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-057.png",
      label: "Atomic Dicer (OP18-057)",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP18",
  cost: 1,
  traits: ["Baroque Works"],
  effect:
    "[Main] You may rest 3 of your DON!! cards: Return up to 1 Character with a cost of 5 or less to the owner's hand.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "returnToHand",
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
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
  i18n: localOp18AtomicDicer057I18n,
};
