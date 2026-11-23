// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localOp18MsAllSunday041I18n } from "./op18-041-ms-all-sunday.i18n.ts";

export const localOp18MsAllSunday041: LeaderCard = {
  id: "OP18-041",
  canonicalId: "OP18-041",
  slug: "ms-all-sunday/op18-041",
  name: "Ms. All Sunday",
  printings: [
    {
      id: "OP18-041",
      artId: "OP18-041",
      setCode: "OP18",
      collectorNumber: "041",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-041.png",
      label: "Ms. All Sunday (OP18-041)",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP18",
  power: 5000,
  life: 5,
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect:
    'When your Character with a type including "Baroque Works" and 3000 base power or more is K.O.\'d, draw 1 card, and your opponent trashes 1 card from their hand.',
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        eventFilter: {
          player: "self",
          filters: [
            {
              filter: "trait",
              value: "Baroque Works",
              match: "includes",
            },
            {
              filter: "basePower",
              comparison: "gte",
              value: 3000,
            },
          ],
        },
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: localOp18MsAllSunday041I18n,
};
