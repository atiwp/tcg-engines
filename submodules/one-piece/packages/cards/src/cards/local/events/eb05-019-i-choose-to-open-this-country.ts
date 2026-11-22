// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05IChooseToOpenThisCountry019I18n } from "./eb05-019-i-choose-to-open-this-country.i18n.ts";

export const localEb05IChooseToOpenThisCountry019: EventCard = {
  id: "EB05-019",
  canonicalId: "EB05-019",
  slug: "i-choose-to-open-this-country/eb05-019",
  name: "I Choose to Open This Country to the World!! I Want to Fight on Your Side!!!",
  printings: [
    {
      id: "EB05-019",
      artId: "EB05-019",
      setCode: "EB05",
      collectorNumber: "019",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-019.jpg",
      label:
        "I Choose to Open This Country to the World!! I Want to Fight on Your Side!!! (EB05-019)",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "EB05",
  cost: 1,
  traits: ["Land of Wano"],
  effect:
    "[Counter] You may rest 1 of your cards: Up to 1 of your {Land of Wano} type Leader or Characters gains +4000 power during this battle.\n[Trigger] If your opponent has 3 or less Life cards, play up to 1 {Land of Wano} type Character card with 6000 power or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                  match: "exact",
                },
              ],
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
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
                value: "Land of Wano",
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
  i18n: localEb05IChooseToOpenThisCountry019I18n,
};
