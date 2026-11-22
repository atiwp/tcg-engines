// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05YouNeedMeDonTYou040I18n } from "./eb05-040-you-need-me-don-t-you.i18n.ts";

export const localEb05YouNeedMeDonTYou040: EventCard = {
  id: "EB05-040",
  canonicalId: "EB05-040",
  slug: "you-need-me-don-t-you/eb05-040",
  name: "You Need Me, Don't You?!!",
  printings: [
    {
      id: "EB05-040",
      artId: "EB05-040",
      setCode: "EB05",
      collectorNumber: "040",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-040.jpg",
      label: "You Need Me, Don't You?!! (EB05-040)",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "EB05",
  cost: 0,
  traits: ["Donquixote Pirates"],
  effect:
    "[Main] You may return 1 of your active DON!! cards to your DON!! deck: If your Leader has the {Donquixote Pirates} type, draw 3 cards and trash 1 card from your hand.\n[Counter] Your Leader gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
            donState: "active",
          },
        ],
        postCostConditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: localEb05YouNeedMeDonTYou040I18n,
};
