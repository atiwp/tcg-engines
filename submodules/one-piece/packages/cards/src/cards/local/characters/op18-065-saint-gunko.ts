// OP Practice local card (fork-only). Source: oplaytcg.com text typed by the user, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18SaintGunko065I18n } from "./op18-065-saint-gunko.i18n.ts";

export const localOp18SaintGunko065: CharacterCard = {
  id: "OP18-065",
  canonicalId: "OP18-065",
  slug: "saint-gunko/op18-065",
  name: "Saint Gunko",
  printings: [
    {
      id: "OP18-065",
      artId: "OP18-065",
      setCode: "OP18",
      collectorNumber: "065",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-065.png",
      label: "Saint Gunko (OP18-065)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP18",
  cost: 10,
  power: 11000,
  traits: ["Celestial Dragons", "Holy Knights of God"],
  attribute: "?",
  effect:
    "[Blocker]\n[On Play] DON!! −1: Play up to 1 Celestial Dragons type Character card with 6000 power or less from your trash.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "trait",
                value: "Celestial Dragons",
                match: "exact",
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18SaintGunko065I18n,
};
