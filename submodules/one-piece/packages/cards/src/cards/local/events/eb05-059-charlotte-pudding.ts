// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05CharlottePudding059I18n } from "./eb05-059-charlotte-pudding.i18n.ts";

export const localEb05CharlottePudding059: EventCard = {
  id: "EB05-059",
  canonicalId: "EB05-059",
  slug: "charlotte-pudding/eb05-059",
  name: "Charlotte Pudding!!",
  printings: [
    {
      id: "EB05-059",
      artId: "EB05-059",
      setCode: "EB05",
      collectorNumber: "059",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-059.jpg",
      label: "Charlotte Pudding!! (EB05-059)",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "EB05",
  cost: 1,
  traits: ["Big Mom Pirates"],
  effect:
    "[Main] Draw 1 card, and all of your Characters with 4000 base power and the {Big Mom Pirates} type cannot be K.O.'d in battle until the end of your opponent's next End Phase.\n[Trigger] Draw 1 card and play up to 1 Character card with 4000 power and a [Trigger] from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "eq",
                  value: 4000,
                },
                {
                  filter: "trait",
                  value: "Big Mom Pirates",
                  match: "exact",
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
            restriction: "inBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
                filter: "power",
                comparison: "eq",
                value: 4000,
              },
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: localEb05CharlottePudding059I18n,
};
