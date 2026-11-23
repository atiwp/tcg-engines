// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Kumadori101I18n } from "./op18-101-kumadori.i18n.ts";

export const localOp18Kumadori101: CharacterCard = {
  id: "OP18-101",
  canonicalId: "OP18-101",
  slug: "kumadori/op18-101",
  name: "Kumadori",
  printings: [
    {
      id: "OP18-101",
      artId: "OP18-101",
      setCode: "OP18",
      collectorNumber: "101",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-101.png",
      label: "Kumadori (OP18-101)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP18",
  cost: 4,
  power: 6000,
  traits: ["CP9"],
  attribute: "strike",
  effect:
    '[On K.O.] Add up to 1 card with a type including "CP" from your hand to the top or bottom of your Life cards face-up.\n[Trigger] If your Leader\'s type includes "CP", K.O. or rest up to 1 of your opponent\'s Characters with a cost of 6 or less.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "CP",
                  match: "includes",
                },
              ],
            },
            position: "choice",
            faceUp: true,
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "CP",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "ko",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 6,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 6,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: localOp18Kumadori101I18n,
};
