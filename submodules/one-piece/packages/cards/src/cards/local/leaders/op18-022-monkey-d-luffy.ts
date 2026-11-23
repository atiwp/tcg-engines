// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localOp18MonkeyDLuffy022I18n } from "./op18-022-monkey-d-luffy.i18n.ts";

export const localOp18MonkeyDLuffy022: LeaderCard = {
  id: "OP18-022",
  canonicalId: "OP18-022",
  slug: "monkey-d-luffy/op18-022",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP18-022",
      artId: "OP18-022",
      setCode: "OP18",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-022.png",
      label: "Monkey.D.Luffy (OP18-022)",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP18",
  power: 5000,
  life: 5,
  traits: ["Water Seven", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x3] [When Attacking] [Once Per Turn] You may set this Leader as active. If you do, this Leader will not become active in your next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
          },
          {
            action: "freeze",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18MonkeyDLuffy022I18n,
};
