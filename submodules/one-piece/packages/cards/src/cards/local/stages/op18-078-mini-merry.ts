// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { StageCard } from "@tcg/op-types";
import { localOp18MiniMerry078I18n } from "./op18-078-mini-merry.i18n.ts";

export const localOp18MiniMerry078: StageCard = {
  id: "OP18-078",
  canonicalId: "OP18-078",
  slug: "mini-merry/op18-078",
  name: "Mini-Merry",
  printings: [
    {
      id: "OP18-078",
      artId: "OP18-078",
      setCode: "OP18",
      collectorNumber: "078",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-078.png",
      label: "Mini-Merry (OP18-078)",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "UC",
  setId: "OP18",
  cost: 5,
  traits: ["Straw Hat Crew"],
  effect:
    "[On Play] Draw 1 card, then add up to 1 DON!! card as rested from your DON!! deck.\n[Activate: Main] You may rest this Stage: Give up to a total of 4 of your Leader or Characters 1 rested DON!! Card each.",
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
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 4,
                upTo: true,
              },
            },
            count: {
              amount: 1,
            },
            donState: "rested",
            distribution: "each",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18MiniMerry078I18n,
};
