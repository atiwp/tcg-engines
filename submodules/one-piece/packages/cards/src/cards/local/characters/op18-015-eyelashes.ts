// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Eyelashes015I18n } from "./op18-015-eyelashes.i18n.ts";

export const localOp18Eyelashes015: CharacterCard = {
  id: "OP18-015",
  canonicalId: "OP18-015",
  slug: "eyelashes/op18-015",
  name: "Eyelashes",
  printings: [
    {
      id: "OP18-015",
      artId: "OP18-015",
      setCode: "OP18",
      collectorNumber: "015",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-015.png",
      label: "Eyelashes (OP18-015)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP18",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  effect:
    "[On Your Opponent's Attack] You may trash this Character: If your Leader has the {Alabasta} type, give up to 1 of your opponent's Leader or Characters −3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        postCostConditions: [
          {
            condition: "leaderTrait",
            trait: "Alabasta",
            match: "exact",
          },
        ],
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
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Eyelashes015I18n,
};
