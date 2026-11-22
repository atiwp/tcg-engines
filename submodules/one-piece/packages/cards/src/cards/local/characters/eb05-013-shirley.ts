// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Shirley013I18n } from "./eb05-013-shirley.i18n.ts";

export const localEb05Shirley013: CharacterCard = {
  id: "EB05-013",
  canonicalId: "EB05-013",
  slug: "shirley/eb05-013",
  name: "Shirley",
  printings: [
    {
      id: "EB05-013",
      artId: "EB05-013",
      setCode: "EB05",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-013.jpg",
      label: "Shirley (EB05-013)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Merfolk", "Fish-Man Island"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] You may rest 1 of your DON!! cards: Your {Fish-Man} or {Merfolk} type Leader gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "trait",
                      value: "Fish-Man",
                      match: "exact",
                    },
                    {
                      filter: "trait",
                      value: "Merfolk",
                      match: "exact",
                    },
                  ],
                },
              ],
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: localEb05Shirley013I18n,
};
