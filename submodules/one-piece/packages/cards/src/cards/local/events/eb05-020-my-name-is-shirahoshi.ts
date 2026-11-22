// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05MyNameIsShirahoshi020I18n } from "./eb05-020-my-name-is-shirahoshi.i18n.ts";

export const localEb05MyNameIsShirahoshi020: EventCard = {
  id: "EB05-020",
  canonicalId: "EB05-020",
  slug: "my-name-is-shirahoshi/eb05-020",
  name: "My name is Shirahoshi!!",
  printings: [
    {
      id: "EB05-020",
      artId: "EB05-020",
      setCode: "EB05",
      collectorNumber: "020",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-020.jpg",
      label: "My name is Shirahoshi!! (EB05-020)",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "EB05",
  cost: 1,
  traits: ["Merfolk", "Fish-Man Island"],
  effect: "[Main] You may rest your Leader [Shirahoshi]: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "leader",
              },
              {
                filter: "name",
                value: "Shirahoshi",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localEb05MyNameIsShirahoshi020I18n,
};
