// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Goldberg086I18n } from "./op18-086-goldberg.i18n.ts";

export const localOp18Goldberg086: CharacterCard = {
  id: "OP18-086",
  canonicalId: "OP18-086",
  slug: "goldberg/op18-086",
  name: "Goldberg",
  printings: [
    {
      id: "OP18-086",
      artId: "OP18-086",
      setCode: "OP18",
      collectorNumber: "086",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-086.png",
      label: "Goldberg (OP18-086)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Giant", "Elbaph", "New Giant Pirates"],
  attribute: "strike",
  effect:
    "This Character gains +12 cost.\n[On K.O.] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 12,
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onKo",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18Goldberg086I18n,
};
