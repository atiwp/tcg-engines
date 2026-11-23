// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18SenorPink068I18n } from "./op18-068-senor-pink.i18n.ts";

export const localOp18SenorPink068: CharacterCard = {
  id: "OP18-068",
  canonicalId: "OP18-068",
  slug: "senor-pink/op18-068",
  name: "Senor Pink",
  printings: [
    {
      id: "OP18-068",
      artId: "OP18-068",
      setCode: "OP18",
      collectorNumber: "068",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-068.png",
      label: "Senor Pink (OP18-068)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP18",
  cost: 8,
  power: 9000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d, you may DON!! −1 instead.\n[On Play] DON!! −1: Up to 1 of your opponent's Characters with a cost of 7 or less cannot be rested until the end of your opponent's next End Phase.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "returnDon",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeRested",
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
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18SenorPink068I18n,
};
