// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05Monet007I18n } from "./eb05-007-monet.i18n.ts";

export const localEb05Monet007: CharacterCard = {
  id: "EB05-007",
  canonicalId: "EB05-007",
  slug: "monet/eb05-007",
  name: "Monet",
  printings: [
    {
      id: "EB05-007",
      artId: "EB05-007",
      setCode: "EB05",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-007.jpg",
      label: "Monet (EB05-007)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB05",
  cost: 2,
  power: 1000,
  counter: 2000,
  traits: ["Donquixote Pirates", "Punk Hazard"],
  attribute: "special",
  effect:
    "[On Play] You may reveal a total of 3 Event or {Punk Hazard} type cards from your hand: Draw 1 card.\n[End of Your Turn] This Character gains +5000 power until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "revealFromHand",
            amount: 3,
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "cardCategory",
                    value: "event",
                  },
                  {
                    filter: "trait",
                    value: "Punk Hazard",
                    match: "exact",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "endOfYourTurn",
        actions: [
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
            value: 5000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: localEb05Monet007I18n,
};
