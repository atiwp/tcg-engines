// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18MrBeansMissKatherina044I18n } from "./op18-044-mr-beans-miss-katherina.i18n.ts";

export const localOp18MrBeansMissKatherina044: CharacterCard = {
  id: "OP18-044",
  canonicalId: "OP18-044",
  slug: "mr-beans-miss-katherina/op18-044",
  name: "Mr.Beans & Miss.Katherina",
  printings: [
    {
      id: "OP18-044",
      artId: "OP18-044",
      setCode: "OP18",
      collectorNumber: "044",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-044.png",
      label: "Mr.Beans & Miss.Katherina (OP18-044)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect:
    "[DON!! x1] This Character gains +1000 power.\n[On Play] Draw 1 card and trash 1 card from your hand.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
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
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: localOp18MrBeansMissKatherina044I18n,
};
