// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { StageCard } from "@tcg/op-types";
import { localOp18SharkSubmerge3076I18n } from "./op18-076-shark-submerge-3.i18n.ts";

export const localOp18SharkSubmerge3076: StageCard = {
  id: "OP18-076",
  canonicalId: "OP18-076",
  slug: "shark-submerge-3/op18-076",
  name: "Shark Submerge 3",
  printings: [
    {
      id: "OP18-076",
      artId: "OP18-076",
      setCode: "OP18",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-076.png",
      label: "Shark Submerge 3 (OP18-076)",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "UC",
  setId: "OP18",
  cost: 5,
  traits: ["Straw Hat Crew"],
  effect:
    "[On Play] Draw 1 card, then add up to 1 DON!! card as rested from your DON!! deck.\n[On Your Opponent's Attack] You may rest this Stage: Your Leader with 5000 power or less and up to 2 of your Characters gain +1000 power during this turn.",
  effects: {
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restThisCard",
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
                  filter: "power",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18SharkSubmerge3076I18n,
};
