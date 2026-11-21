// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05JewelryBonney001I18n } from "./eb05-001-jewelry-bonney.i18n.ts";

export const localEb05JewelryBonney001: CharacterCard = {
  id: "EB05-001",
  canonicalId: "EB05-001",
  slug: "jewelry-bonney/eb05-001",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "EB05-001",
      artId: "EB05-001",
      setCode: "EB05",
      collectorNumber: "001",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-001.jpg",
      label: "Jewelry Bonney (EB05-001)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB05",
  cost: 5,
  power: 7000,
  traits: ["Bonney Pirates", "Supernovas"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Supernovas} type, draw 2 cards and play up to 2 Character cards with 2000 power or less from your hand.\n[Activate: Main] [Once Per Turn] Give up to 1 of your opponent's Leader or Characters with 6000 power or more-1000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 2,
              upTo: true,
            },
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 2000,
              },
            ],
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "gte",
                  value: 6000,
                },
              ],
            },
            value: -1000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: localEb05JewelryBonney001I18n,
};
