// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Smoker007I18n } from "./op18-007-smoker.i18n.ts";

export const localOp18Smoker007: CharacterCard = {
  id: "OP18-007",
  canonicalId: "OP18-007",
  slug: "smoker/op18-007",
  name: "Smoker",
  printings: [
    {
      id: "OP18-007",
      artId: "OP18-007",
      setCode: "OP18",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-007.png",
      label: "Smoker (OP18-007)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Alabasta", "Navy"],
  attribute: "special",
  effect:
    "If your Leader has the {Navy} type, this Character gains [Banish] and +1000 power.\n(When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Navy",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "permanent",
          },
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
          },
        ],
      },
    ],
  },
  i18n: localOp18Smoker007I18n,
};
