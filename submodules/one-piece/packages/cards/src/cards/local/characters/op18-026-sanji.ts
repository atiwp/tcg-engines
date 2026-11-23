// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Sanji026I18n } from "./op18-026-sanji.i18n.ts";

export const localOp18Sanji026: CharacterCard = {
  id: "OP18-026",
  canonicalId: "OP18-026",
  slug: "sanji/op18-026",
  name: "Sanji",
  printings: [
    {
      id: "OP18-026",
      artId: "OP18-026",
      setCode: "OP18",
      collectorNumber: "026",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-026.png",
      label: "Sanji (OP18-026)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP18",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Water Seven", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "If your {Straw Hat Crew} type Character would be removed from the field by your opponent's effect, you may trash this Character instead.",
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
              value: "Straw Hat Crew",
              match: "exact",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "trashThisCard",
        },
      },
    ],
  },
  i18n: localOp18Sanji026I18n,
};
