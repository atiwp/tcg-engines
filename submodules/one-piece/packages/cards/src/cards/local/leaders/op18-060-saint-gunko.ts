// OP Practice local card (fork-only). Source: oplaytcg.com text typed by the user, 2026-11-21. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localOp18SaintGunko060I18n } from "./op18-060-saint-gunko.i18n.ts";

export const localOp18SaintGunko060: LeaderCard = {
  id: "OP18-060",
  canonicalId: "OP18-060",
  slug: "saint-gunko/op18-060",
  name: "Saint Gunko",
  printings: [
    {
      id: "OP18-060",
      artId: "OP18-060",
      setCode: "OP18",
      collectorNumber: "060",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-060.png",
      label: "Saint Gunko (OP18-060)",
    },
  ],
  cardType: "leader",
  color: ["purple", "black"],
  rarity: "L",
  setId: "OP18",
  power: 5000,
  life: 4,
  traits: ["Celestial Dragons", "Holy Knights of God"],
  attribute: "special",
  effect:
    "[Once Per Turn] When a Character is played from your trash, draw 2 cards and trash 1 card from your hand.\n[Activate: Main] [Once Per Turn] You may trash 1 card from your hand: If you have a Character with 8000 base power or more, add up to 1 DON!! card as active from your DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "whenYouPlayCharacter",
        conditions: [
          {
            condition: "triggerEventFromZone",
            zone: "trash",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        postCostConditions: [
          {
            condition: "existsOnField",
            player: "self",
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
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18SaintGunko060I18n,
};
