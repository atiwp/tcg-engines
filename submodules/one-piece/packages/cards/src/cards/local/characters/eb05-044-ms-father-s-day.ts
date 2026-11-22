// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05MsFatherSDay044I18n } from "./eb05-044-ms-father-s-day.i18n.ts";

export const localEb05MsFatherSDay044: CharacterCard = {
  id: "EB05-044",
  canonicalId: "EB05-044",
  slug: "ms-father-s-day/eb05-044",
  name: "Ms. Father's Day",
  printings: [
    {
      id: "EB05-044",
      artId: "EB05-044",
      setCode: "EB05",
      collectorNumber: "044",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-044.jpg",
      label: "Ms. Father's Day (EB05-044)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB05",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "ranged",
  effect:
    "[On Play] If your Leader's type includes \"Baroque Works\" and your opponent has a Character with a cost of 0, give your opponent's Leader -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
            match: "includes",
          },
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: localEb05MsFatherSDay044I18n,
};
