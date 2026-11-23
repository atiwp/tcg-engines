// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18BusterCall117I18n } from "./op18-117-buster-call.i18n.ts";

export const localOp18BusterCall117: EventCard = {
  id: "OP18-117",
  canonicalId: "OP18-117",
  slug: "buster-call/op18-117",
  name: "Buster Call",
  printings: [
    {
      id: "OP18-117",
      artId: "OP18-117",
      setCode: "OP18",
      collectorNumber: "117",
      rarity: "R",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-117.png",
      label: "Buster Call (OP18-117)",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP18",
  cost: 10,
  traits: ["Navy", "CP9"],
  effect:
    "[Main] You may trash all of your Life cards: If your Leader is [Spandam], trash all Characters and play up to a total of 5 {Vice Admiral} type Character cards with different card names from your deck or trash. Then, shuffle your deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "removeFromLife",
            player: "self",
            count: {
              untilRemaining: 0,
            },
            destination: "trash",
          },
          {
            action: "conditional",
            predicate: {
              condition: "leaderName",
              name: "Spandam",
            },
            whenTrue: [
              {
                action: "trashFromField",
                target: {
                  player: "any",
                  zones: ["character"],
                  count: {
                    amount: "all",
                  },
                },
              },
              {
                action: "play",
                source: {
                  player: "self",
                  zone: ["deck", "trash"],
                },
                count: {
                  amount: 5,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "cardCategory",
                    value: "character",
                  },
                  {
                    filter: "trait",
                    value: "Vice Admiral",
                    match: "exact",
                  },
                ],
                differentNames: true,
              },
              {
                action: "shuffleDeck",
                player: "self",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: localOp18BusterCall117I18n,
};
