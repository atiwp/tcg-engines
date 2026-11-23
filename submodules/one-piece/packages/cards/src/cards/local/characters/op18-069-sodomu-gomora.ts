// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18SodomuGomora069I18n } from "./op18-069-sodomu-gomora.i18n.ts";

export const localOp18SodomuGomora069: CharacterCard = {
  id: "OP18-069",
  canonicalId: "OP18-069",
  slug: "sodomu-gomora/op18-069",
  name: "Sodomu & Gomora",
  printings: [
    {
      id: "OP18-069",
      artId: "OP18-069",
      setCode: "OP18",
      collectorNumber: "069",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-069.png",
      label: "Sodomu & Gomora (OP18-069)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP18",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Animal", "Water Seven", "The Franky Family"],
  attribute: "strike",
  effect:
    "If your {The Franky Family} type Character would be K.O.'d, you may DON!! −1 and rest this Character instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "trait",
              value: "The Franky Family",
              match: "exact",
            },
          ],
        },
        replacementAction: {
          action: "sequence",
          actions: [
            {
              action: "returnDon",
              player: "self",
              amount: 1,
            },
            {
              action: "rest",
              target: {
                player: "self",
                zones: ["character"],
                count: {
                  amount: 1,
                },
                self: true,
              },
            },
          ],
        },
      },
    ],
  },
  i18n: localOp18SodomuGomora069I18n,
};
