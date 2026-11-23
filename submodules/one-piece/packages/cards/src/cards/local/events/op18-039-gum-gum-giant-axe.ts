// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18GumGumGiantAxe039I18n } from "./op18-039-gum-gum-giant-axe.i18n.ts";

export const localOp18GumGumGiantAxe039: EventCard = {
  id: "OP18-039",
  canonicalId: "OP18-039",
  slug: "gum-gum-giant-axe/op18-039",
  name: "Gum-Gum Giant Axe",
  printings: [
    {
      id: "OP18-039",
      artId: "OP18-039",
      setCode: "OP18",
      collectorNumber: "039",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-039.png",
      label: "Gum-Gum Giant Axe (OP18-039)",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP18",
  cost: 1,
  traits: ["Water Seven", "Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your [Monkey.D.Luffy] gains +2000 power during this battle. Then, if your Leader is active, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "leader",
              filters: [
                {
                  filter: "state",
                  value: "active",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: localOp18GumGumGiantAxe039I18n,
};
