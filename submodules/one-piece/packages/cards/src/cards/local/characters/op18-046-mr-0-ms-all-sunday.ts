// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr0MsAllSunday046I18n } from "./op18-046-mr-0-ms-all-sunday.i18n.ts";

export const localOp18Mr0MsAllSunday046: CharacterCard = {
  id: "OP18-046",
  canonicalId: "OP18-046",
  slug: "mr-0-ms-all-sunday/op18-046",
  name: "Mr.0 & Ms. All Sunday",
  printings: [
    {
      id: "OP18-046",
      artId: "OP18-046",
      setCode: "OP18",
      collectorNumber: "046",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-046.png",
      label: "Mr.0 & Ms. All Sunday (OP18-046)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP18",
  cost: 9,
  power: 10000,
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  attribute: ["special", "wisdom"],
  effect:
    '[On Play] Draw 2 cards and give your Leader and all of your Characters up to 2 rested DON!! cards each.\n[On Your Opponent\'s Attack] You may trash 1 card from your hand: The base power of your Leader with a type including "Baroque Works" becomes 7000 during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: "all",
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
            distribution: "each",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Baroque Works",
                  match: "includes",
                },
              ],
            },
            value: 7000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Mr0MsAllSunday046I18n,
};
