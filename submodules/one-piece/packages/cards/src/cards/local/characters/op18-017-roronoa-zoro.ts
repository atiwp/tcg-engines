// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18RoronoaZoro017I18n } from "./op18-017-roronoa-zoro.i18n.ts";

export const localOp18RoronoaZoro017: CharacterCard = {
  id: "OP18-017",
  canonicalId: "OP18-017",
  slug: "roronoa-zoro/op18-017",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP18-017",
      artId: "OP18-017",
      setCode: "OP18",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-017.png",
      label: "Roronoa Zoro (OP18-017)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta", "Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[Once Per Turn] If your {Alabasta} type Character would be removed from the field by your opponent's effect, you may give your Leader −2000 power during this turn instead.\n[When Attacking] Up to 1 of your {Alabasta} type Characters gains [Rush] during this turn.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "trait",
              value: "Alabasta",
              match: "exact",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["leader"],
            count: {
              amount: 1,
            },
          },
          value: -2000,
          duration: "thisTurn",
        },
        oncePerTurn: true,
      },
    ],
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
  i18n: localOp18RoronoaZoro017I18n,
};
