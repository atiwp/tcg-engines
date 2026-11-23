// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18TonyTonyChopper010I18n } from "./op18-010-tony-tony-chopper.i18n.ts";

export const localOp18TonyTonyChopper010: CharacterCard = {
  id: "OP18-010",
  canonicalId: "OP18-010",
  slug: "tony-tony-chopper/op18-010",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP18-010",
      artId: "OP18-010",
      setCode: "OP18",
      collectorNumber: "010",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-010.png",
      label: "Tony Tony.Chopper (OP18-010)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP18",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Animal", "Alabasta", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On K.O.] Add up to 1 Character card with 4000 power or less from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
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
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18TonyTonyChopper010I18n,
};
