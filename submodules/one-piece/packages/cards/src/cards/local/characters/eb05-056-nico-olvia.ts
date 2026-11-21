// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05NicoOlvia056I18n } from "./eb05-056-nico-olvia.i18n.ts";

export const localEb05NicoOlvia056: CharacterCard = {
  id: "EB05-056",
  canonicalId: "EB05-056",
  slug: "nico-olvia/eb05-056",
  name: "Nico Olvia",
  printings: [
    {
      id: "EB05-056",
      artId: "EB05-056",
      setCode: "EB05",
      collectorNumber: "056",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-056.jpg",
      label: "Nico Olvia (EB05-056)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB05",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Ohara"],
  attribute: "wisdom",
  effect:
    "[On Play] You may trash 1 card with a Trigger from your hand: If your Leader is [Nico Robin], draw 2 cards.\n[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
            condition: {
              condition: "leaderName",
              name: "Nico Robin",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: localEb05NicoOlvia056I18n,
};
