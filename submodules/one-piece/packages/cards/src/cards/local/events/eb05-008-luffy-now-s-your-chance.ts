// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05LuffyNowSYourChance008I18n } from "./eb05-008-luffy-now-s-your-chance.i18n.ts";

export const localEb05LuffyNowSYourChance008: EventCard = {
  id: "EB05-008",
  canonicalId: "EB05-008",
  slug: "luffy-now-s-your-chance/eb05-008",
  name: "Luffy, Now's Your Chance",
  printings: [
    {
      id: "EB05-008",
      artId: "EB05-008",
      setCode: "EB05",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-008.jpg",
      label: "Luffy, Now's Your Chance (EB05-008)",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "EB05",
  cost: 1,
  traits: ["Kuja Pirates", "The Seven Warlords of the Sea"],
  effect:
    "[Main] You may give 1 active DON!! card to 1 of your Leader and reveal 2 red Event cards from your hand: Give up to 1 of your opponent's rested Characters -7000 power during this turn.\n[Counter] If you have no Characters with a cost of 5 or more, up to 1 of your Leader or up to 1 of your Characters gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "giveDon",
            amount: 1,
            donState: "active",
            recipientZones: ["leader"],
          },
          {
            cost: "revealFromHand",
            amount: 2,
            filters: [
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
            value: -7000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 5,
              },
            ],
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
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: localEb05LuffyNowSYourChance008I18n,
};
