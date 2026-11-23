// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localOp18Karoo001I18n } from "./op18-001-karoo.i18n.ts";

export const localOp18Karoo001: LeaderCard = {
  id: "OP18-001",
  canonicalId: "OP18-001",
  slug: "karoo/op18-001",
  name: "Karoo",
  printings: [
    {
      id: "OP18-001",
      artId: "OP18-001",
      setCode: "OP18",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-001.png",
      label: "Karoo (OP18-001)",
    },
  ],
  cardType: "leader",
  color: ["red", "blue"],
  rarity: "L",
  setId: "OP18",
  power: 5000,
  life: 4,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  effect:
    "All of your Characters with both the {Animal} and {Alabasta} types gain [Rush] and +1000 power.\n[Once Per Turn] When your {Alabasta} type Character is K.O.'d, draw 1 card.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Animal",
                  match: "exact",
                },
                {
                  filter: "trait",
                  value: "Alabasta",
                  match: "exact",
                },
              ],
            },
            keyword: "rush",
            duration: "permanent",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Animal",
                  match: "exact",
                },
                {
                  filter: "trait",
                  value: "Alabasta",
                  match: "exact",
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "whenCharacterKod",
        eventFilter: {
          player: "self",
          filters: [
            {
              filter: "trait",
              value: "Alabasta",
              match: "exact",
            },
          ],
        },
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: localOp18Karoo001I18n,
};
