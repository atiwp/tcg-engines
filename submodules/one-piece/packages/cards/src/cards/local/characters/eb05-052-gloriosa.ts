// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Gloriosa052I18n } from "./eb05-052-gloriosa.i18n.ts";

export const localEb05Gloriosa052: CharacterCard = {
  id: "EB05-052",
  canonicalId: "EB05-052",
  slug: "gloriosa/eb05-052",
  name: "Gloriosa",
  printings: [
    {
      id: "EB05-052",
      artId: "EB05-052",
      setCode: "EB05",
      collectorNumber: "052",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-052.jpg",
      label: "Gloriosa (EB05-052)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB05",
  cost: 4,
  power: 6000,
  traits: ["Amazon Lily", "Rocks Pirates"],
  attribute: "wisdom",
  effect:
    "If you would take damage, you may trash this Character instead.\n[Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: localEb05Gloriosa052I18n,
};
