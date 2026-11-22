// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Sugar034I18n } from "./eb05-034-sugar.i18n.ts";

export const localEb05Sugar034: CharacterCard = {
  id: "EB05-034",
  canonicalId: "EB05-034",
  slug: "sugar/eb05-034",
  name: "Sugar",
  printings: [
    {
      id: "EB05-034",
      artId: "EB05-034",
      setCode: "EB05",
      collectorNumber: "034",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-034.jpg",
      label: "Sugar (EB05-034)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "EB05",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Play] DON!! -2: If you have 7 or more DON!! cards on your field, give up to 1 of your opponent's Characters-4000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        postCostConditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localEb05Sugar034I18n,
};
