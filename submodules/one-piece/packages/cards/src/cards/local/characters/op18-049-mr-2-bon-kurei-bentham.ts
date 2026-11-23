// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18Mr2BonKureiBentham049I18n } from "./op18-049-mr-2-bon-kurei-bentham.i18n.ts";

export const localOp18Mr2BonKureiBentham049: CharacterCard = {
  id: "OP18-049",
  canonicalId: "OP18-049",
  slug: "mr-2-bon-kurei-bentham/op18-049",
  name: "Mr.2.Bon.Kurei(Bentham)",
  printings: [
    {
      id: "OP18-049",
      artId: "OP18-049",
      setCode: "OP18",
      collectorNumber: "049",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-049.png",
      label: "Mr.2.Bon.Kurei(Bentham) (OP18-049)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works", add it to your hand and place the rest at the bottom of your deck in any order. Then, give up to 1 rested DON!! card to your Leader or 1 of your Characters.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Baroque Works",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: localOp18Mr2BonKureiBentham049I18n,
};
