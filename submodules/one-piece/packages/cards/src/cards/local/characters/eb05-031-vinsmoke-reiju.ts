// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05VinsmokeReiju031I18n } from "./eb05-031-vinsmoke-reiju.i18n.ts";

export const localEb05VinsmokeReiju031: CharacterCard = {
  id: "EB05-031",
  canonicalId: "EB05-031",
  slug: "vinsmoke-reiju/eb05-031",
  name: "Vinsmoke Reiju",
  printings: [
    {
      id: "EB05-031",
      artId: "EB05-031",
      setCode: "EB05",
      collectorNumber: "031",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-031.jpg",
      label: "Vinsmoke Reiju (EB05-031)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB05",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family", "GERMA 66"],
  attribute: "special",
  effect:
    "[On Play] DON!! -1: If your Leader has the {The Vinsmoke Family} type, trash 10 cards from the top of your deck.\n[Activate: Main] You may trash this Character: If your opponent has a Character with 8000 base power or more, add up to 4 DON!! cards as active from your DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        postCostConditions: [
          {
            condition: "leaderTrait",
            trait: "The Vinsmoke Family",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 10,
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        postCostConditions: [
          {
            condition: "existsOnField",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "basePower",
                comparison: "gte",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 4,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localEb05VinsmokeReiju031I18n,
};
