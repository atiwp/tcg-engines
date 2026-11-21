// OP Practice local card (fork-only). Source: oplaytcg.com text typed by the user, 2026-11-21. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Sleeptids093I18n } from "./op18-093-sleeptids.i18n.ts";

export const localOp18Sleeptids093: CharacterCard = {
  id: "OP18-093",
  canonicalId: "OP18-093",
  slug: "sleeptids/op18-093",
  name: "Sleeptids",
  printings: [
    {
      id: "OP18-093",
      artId: "OP18-093",
      setCode: "OP18",
      collectorNumber: "093",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-093.png",
      label: "Sleeptids (OP18-093)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP18",
  cost: 9,
  power: 3000,
  counter: 2000,
  traits: ["Elbaph"],
  attribute: "special",
  effect:
    "Under the rules of this game, you may have any number of this card in your deck.\n[Blocker]",
  effects: {
    keywords: ["blocker"],
    deckBuildingRules: [
      {
        rule: "unlimitedCopies",
      },
    ],
  },
  i18n: localOp18Sleeptids093I18n,
};
