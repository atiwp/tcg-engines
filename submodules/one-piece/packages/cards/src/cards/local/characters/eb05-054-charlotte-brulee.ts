// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05CharlotteBrulee054I18n } from "./eb05-054-charlotte-brulee.i18n.ts";

export const localEb05CharlotteBrulee054: CharacterCard = {
  id: "EB05-054",
  canonicalId: "EB05-054",
  slug: "charlotte-brulee/eb05-054",
  name: "Charlotte Brulee",
  printings: [
    {
      id: "EB05-054",
      artId: "EB05-054",
      setCode: "EB05",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-054.jpg",
      label: "Charlotte Brulee (EB05-054)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Trigger] Play up to 2 {Big Mom Pirates} type Character cards with 4000 power from your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
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
                filter: "trait",
                value: "Big Mom Pirates",
                match: "exact",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 4000,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: localEb05CharlotteBrulee054I18n,
};
