// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Hack042I18n } from "./op18-042-hack.i18n.ts";

export const localOp18Hack042: CharacterCard = {
  id: "OP18-042",
  canonicalId: "OP18-042",
  slug: "hack/op18-042",
  name: "Hack",
  printings: [
    {
      id: "OP18-042",
      artId: "OP18-042",
      setCode: "OP18",
      collectorNumber: "042",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-042.png",
      label: "Hack (OP18-042)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 4000,
  traits: ["Fish-Man", "Dressrosa", "Revolutionary Army"],
  attribute: "strike",
  effect:
    "[On K.O.] Draw 1 card.\n[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your {Dressrosa} type Leader or Characters.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                  match: "exact",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18Hack042I18n,
};
