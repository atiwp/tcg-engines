// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18DiableJambeFlambShot040I18n } from "./op18-040-diable-jambe-flamb-shot.i18n.ts";

export const localOp18DiableJambeFlambShot040: EventCard = {
  id: "OP18-040",
  canonicalId: "OP18-040",
  slug: "diable-jambe-flamb-shot/op18-040",
  name: "Diable Jambe Flambé Shot",
  printings: [
    {
      id: "OP18-040",
      artId: "OP18-040",
      setCode: "OP18",
      collectorNumber: "040",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-040.png",
      label: "Diable Jambe Flambé Shot (OP18-040)",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP18",
  cost: 4,
  traits: ["Water Seven", "Straw Hat Crew"],
  effect:
    "[Main] K.O. up to 1 of your opponent's rested Characters with a cost of 7 or less.\n[Trigger] Rest up to 1 of your opponent's Characters with a cost of 7 or less.",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
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
                  value: 7,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18DiableJambeFlambShot040I18n,
};
