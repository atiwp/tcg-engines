// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18KungFuJugon005I18n } from "./op18-005-kung-fu-jugon.i18n.ts";

export const localOp18KungFuJugon005: CharacterCard = {
  id: "OP18-005",
  canonicalId: "OP18-005",
  slug: "kung-fu-jugon/op18-005",
  name: "Kung Fu Jugon",
  printings: [
    {
      id: "OP18-005",
      artId: "OP18-005",
      setCode: "OP18",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-005.png",
      label: "Kung Fu Jugon (OP18-005)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  effect: "[Your Turn] This Character gains +1000 power for every [Kung Fu Jugon].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
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
            valuePerCardGroup: {
              target: {
                player: "self",
                zones: ["character"],
                count: {
                  amount: "all",
                },
                filters: [
                  {
                    filter: "name",
                    value: "Kung Fu Jugon",
                  },
                ],
              },
              size: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18KungFuJugon005I18n,
};
