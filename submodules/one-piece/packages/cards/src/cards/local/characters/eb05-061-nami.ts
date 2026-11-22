// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Nami061I18n } from "./eb05-061-nami.i18n.ts";

export const localEb05Nami061: CharacterCard = {
  id: "EB05-061",
  canonicalId: "EB05-061",
  slug: "nami/eb05-061",
  name: "Nami",
  printings: [
    {
      id: "EB05-061",
      artId: "EB05-061",
      setCode: "EB05",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-061.jpg",
      label: "Nami (EB05-061)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "EB05",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[Once Per Turn] If one of your Characters with 6000 base power or less would be removed from the field by your opponent, you may add 1 card from the top of your Life cards to your hand instead.\n[On Play] Play up to 1 red Character card with a cost of 2 or less from your hand.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "lte",
              value: 6000,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "hand",
          position: "top",
        },
        oncePerTurn: true,
        oncePerTurnKey: "eb05-061-nami",
      },
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "lte",
              value: 6000,
            },
          ],
        },
        source: "battle",
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "hand",
          position: "top",
        },
        oncePerTurn: true,
        oncePerTurnKey: "eb05-061-nami",
      },
    ],
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
                filter: "color",
                value: "red",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: localEb05Nami061I18n,
};
