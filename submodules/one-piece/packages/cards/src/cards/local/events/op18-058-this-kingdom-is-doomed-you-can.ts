// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18ThisKingdomIsDoomedYouCan058I18n } from "./op18-058-this-kingdom-is-doomed-you-can.i18n.ts";

export const localOp18ThisKingdomIsDoomedYouCan058: EventCard = {
  id: "OP18-058",
  canonicalId: "OP18-058",
  slug: "this-kingdom-is-doomed-you-can/op18-058",
  name: "This Kingdom is Doomed. You Can't Save It!",
  printings: [
    {
      id: "OP18-058",
      artId: "OP18-058",
      setCode: "OP18",
      collectorNumber: "058",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-058.png",
      label: "This Kingdom is Doomed. You Can't Save It! (OP18-058)",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  effect:
    "[Main] You may return 1 of your Characters to the owner's hand: Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.\n[Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
          },
        ],
        actions: [
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
                  value: 4,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: localOp18ThisKingdomIsDoomedYouCan058I18n,
};
