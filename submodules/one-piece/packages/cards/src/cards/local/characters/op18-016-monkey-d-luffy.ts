// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18MonkeyDLuffy016I18n } from "./op18-016-monkey-d-luffy.i18n.ts";

export const localOp18MonkeyDLuffy016: CharacterCard = {
  id: "OP18-016",
  canonicalId: "OP18-016",
  slug: "monkey-d-luffy/op18-016",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP18-016",
      artId: "OP18-016",
      setCode: "OP18",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-016.png",
      label: "Monkey.D.Luffy (OP18-016)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Alabasta", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Banish]\n[On K.O.] Play up to 1 {Alabasta} type Character card with 6000 power or less from your hand.",
  effects: {
    keywords: ["banish"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
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
                value: "Alabasta",
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
      },
    ],
  },
  i18n: localOp18MonkeyDLuffy016I18n,
};
