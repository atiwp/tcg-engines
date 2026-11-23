// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18MrPrince045I18n } from "./op18-045-mr-prince.i18n.ts";

export const localOp18MrPrince045: CharacterCard = {
  id: "OP18-045",
  canonicalId: "OP18-045",
  slug: "mr-prince/op18-045",
  name: "Mr.Prince",
  printings: [
    {
      id: "OP18-045",
      artId: "OP18-045",
      setCode: "OP18",
      collectorNumber: "045",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-045.png",
      label: "Mr.Prince (OP18-045)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Alabasta", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "Also treat this card's name as [Sanji] according to the rules.\nThis Character gains +1000 power for every 5 Events in your trash.",
  alternateNames: ["Sanji"],
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
            valuePerCardGroup: {
              target: {
                player: "self",
                zones: ["trash"],
                count: {
                  amount: "all",
                },
                filters: [
                  {
                    filter: "cardCategory",
                    value: "event",
                  },
                ],
              },
              size: 5,
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18MrPrince045I18n,
};
