// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr13MsFriday056I18n } from "./op18-056-mr-13-ms-friday.i18n.ts";

export const localOp18Mr13MsFriday056: CharacterCard = {
  id: "OP18-056",
  canonicalId: "OP18-056",
  slug: "mr-13-ms-friday/op18-056",
  name: "Mr.13 & Ms.Friday",
  printings: [
    {
      id: "OP18-056",
      artId: "OP18-056",
      setCode: "OP18",
      collectorNumber: "056",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-056.png",
      label: "Mr.13 & Ms.Friday (OP18-056)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal", "Baroque Works"],
  attribute: "wisdom",
  effect:
    '[DON!! x1] This Character gains +1000 power.\n[On Play] You may place 1 of your Characters with a type including "Baroque Works" other than this Character at the bottom of your deck: Your opponent trashes 1 card from their hand.',
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
        costs: [
          {
            cost: "returnCharacterToDeck",
            amount: 1,
            position: "bottom",
            player: "self",
            filters: [
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
              {
                filter: "excludeSelf",
              },
            ],
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Mr13MsFriday056I18n,
};
