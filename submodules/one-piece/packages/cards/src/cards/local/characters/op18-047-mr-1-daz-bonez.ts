// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr1DazBonez047I18n } from "./op18-047-mr-1-daz-bonez.i18n.ts";

export const localOp18Mr1DazBonez047: CharacterCard = {
  id: "OP18-047",
  canonicalId: "OP18-047",
  slug: "mr-1-daz-bonez/op18-047",
  name: "Mr.1(Daz.Bonez)",
  printings: [
    {
      id: "OP18-047",
      artId: "OP18-047",
      setCode: "OP18",
      collectorNumber: "047",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-047.png",
      label: "Mr.1(Daz.Bonez) (OP18-047)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP18",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Cross Guild", "Former Baroque Works"],
  attribute: "slash",
  effect:
    '[On Play] Your Leader with the {Cross Guild} type or a type including "Baroque Works" gains [Unblockable] during this turn.\n(This card cannot be blocked.)',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "trait",
                      value: "Cross Guild",
                      match: "exact",
                    },
                    {
                      filter: "trait",
                      value: "Baroque Works",
                      match: "includes",
                    },
                  ],
                },
              ],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: localOp18Mr1DazBonez047I18n,
};
