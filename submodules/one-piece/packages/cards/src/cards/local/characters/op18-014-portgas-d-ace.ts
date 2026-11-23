// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18PortgasDAce014I18n } from "./op18-014-portgas-d-ace.i18n.ts";

export const localOp18PortgasDAce014: CharacterCard = {
  id: "OP18-014",
  canonicalId: "OP18-014",
  slug: "portgas-d-ace/op18-014",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP18-014",
      artId: "OP18-014",
      setCode: "OP18",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-014.png",
      label: "Portgas.D.Ace (OP18-014)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 3,
  power: 5000,
  traits: ["Alabasta", "Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] Up to 1 of your {Alabasta} type Characters gains [Rush] during this turn.\n(This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Alabasta",
                  match: "exact",
                },
              ],
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: localOp18PortgasDAce014I18n,
};
