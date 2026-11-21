// OP Practice local card (fork-only). Source: oplaytcg.com text typed by the user, 2026-11-21. See ../LOCAL-CARDS.md.
import type { StageCard } from "@tcg/op-types";
import { localOp18AbyssPentagram097I18n } from "./op18-097-abyss-pentagram.i18n.ts";

export const localOp18AbyssPentagram097: StageCard = {
  id: "OP18-097",
  canonicalId: "OP18-097",
  slug: "abyss-pentagram/op18-097",
  name: "Abyss Pentagram",
  printings: [
    {
      id: "OP18-097",
      artId: "OP18-097",
      setCode: "OP18",
      collectorNumber: "097",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-097.png",
      label: "Abyss Pentagram (OP18-097)",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "UC",
  setId: "OP18",
  cost: 1,
  traits: ["Celestial Dragons", "Holy Knights of God", "Five Elders"],
  effect:
    "If your Leader has the Celestial Dragons type, the cost of playing Holy Knights of God or Five Elders type Character cards with a cost of 2 or more from your hand will be reduced by 1.\n[On Play] Draw 1 card and trash 2 cards from the top of your deck.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Celestial Dragons",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            paymentOnly: true,
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "trait",
                      value: "Holy Knights of God",
                      match: "exact",
                    },
                    {
                      filter: "trait",
                      value: "Five Elders",
                      match: "exact",
                    },
                  ],
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 2,
                },
              ],
            },
            value: -1,
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
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: localOp18AbyssPentagram097I18n,
};
