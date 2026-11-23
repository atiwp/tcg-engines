// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localOp18Spandam079I18n } from "./op18-079-spandam.i18n.ts";

export const localOp18Spandam079: LeaderCard = {
  id: "OP18-079",
  canonicalId: "OP18-079",
  slug: "spandam/op18-079",
  name: "Spandam",
  printings: [
    {
      id: "OP18-079",
      artId: "OP18-079",
      setCode: "OP18",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-079.png",
      label: "Spandam (OP18-079)",
    },
  ],
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "OP18",
  power: 5000,
  life: 4,
  traits: ["CP9"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may rest 2 of your DON!! cards and this Leader and trash 1 card with a type including "CP" from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
          {
            cost: "restThisCard",
          },
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "CP",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18Spandam079I18n,
};
