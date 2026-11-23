// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Trebol071I18n } from "./op18-071-trebol.i18n.ts";

export const localOp18Trebol071: CharacterCard = {
  id: "OP18-071",
  canonicalId: "OP18-071",
  slug: "trebol/op18-071",
  name: "Trebol",
  printings: [
    {
      id: "OP18-071",
      artId: "OP18-071",
      setCode: "OP18",
      collectorNumber: "071",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-071.png",
      label: "Trebol (OP18-071)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Once Per Turn] If your {Donquixote Pirates} type Character would be removed from the field by your opponent's effect, you may DON!! −1 instead.\n[Opponent's Turn] If your Leader is {Sugar}, this Characters gains [Blocker] and +2000 power.",
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
              value: "Donquixote Pirates",
              match: "exact",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "returnDon",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "leaderName",
            name: "Sugar",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: localOp18Trebol071I18n,
};
