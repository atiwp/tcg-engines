// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18VanAugur080I18n } from "./op18-080-van-augur.i18n.ts";

export const localOp18VanAugur080: CharacterCard = {
  id: "OP18-080",
  canonicalId: "OP18-080",
  slug: "van-augur/op18-080",
  name: "Van Augur",
  printings: [
    {
      id: "OP18-080",
      artId: "OP18-080",
      setCode: "OP18",
      collectorNumber: "080",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-080.png",
      label: "Van Augur (OP18-080)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP18",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Egghead", "Blackbeard Pirates"],
  attribute: "ranged",
  effect:
    "[Your Turn] [Once Per Turn] When a card is trashed from your hand by your [Marshall.D.Teach] Leader's effect, if you have no other [Van Augur], draw 1 card.\n[On K.O.] Draw 1 Card.",
  effects: {
    effects: [
      {
        trigger: "whenCardTrashedFromHandByEffect",
        eventFilter: {
          player: "self",
          causedBy: "self",
          sourceFilters: [
            {
              filter: "cardCategory",
              value: "leader",
            },
            {
              filter: "name",
              value: "Marshall.D.Teach",
            },
          ],
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "notHasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "excludeSelf",
              },
              {
                filter: "name",
                value: "Van Augur",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: localOp18VanAugur080I18n,
};
