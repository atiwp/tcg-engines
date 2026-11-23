// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localOp18LetSGoKaroo018I18n } from "./op18-018-let-s-go-karoo.i18n.ts";

export const localOp18LetSGoKaroo018: EventCard = {
  id: "OP18-018",
  canonicalId: "OP18-018",
  slug: "let-s-go-karoo/op18-018",
  name: "Let's Go, Karoo!!",
  printings: [
    {
      id: "OP18-018",
      artId: "OP18-018",
      setCode: "OP18",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-018.png",
      label: "Let's Go, Karoo!! (OP18-018)",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP18",
  cost: 1,
  traits: ["Alabasta"],
  effect:
    "[Main] All of your {Alabasta} type Characters gain +1000 power during this turn.\n[Trigger] Up to 1 of your Leader or Characters gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
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
                  value: "Alabasta",
                  match: "exact",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: localOp18LetSGoKaroo018I18n,
};
