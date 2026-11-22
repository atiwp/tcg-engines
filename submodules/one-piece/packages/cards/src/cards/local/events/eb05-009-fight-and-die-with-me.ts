// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { EventCard } from "@tcg/op-types";
import { localEb05FightAndDieWithMe009I18n } from "./eb05-009-fight-and-die-with-me.i18n.ts";

export const localEb05FightAndDieWithMe009: EventCard = {
  id: "EB05-009",
  canonicalId: "EB05-009",
  slug: "fight-and-die-with-me/eb05-009",
  name: "Fight and Die with Me!!!",
  printings: [
    {
      id: "EB05-009",
      artId: "EB05-009",
      setCode: "EB05",
      collectorNumber: "009",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-009.jpg",
      label: "Fight and Die with Me!!! (EB05-009)",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "EB05",
  cost: 1,
  traits: ["Straw Hat Crew", "East Blue"],
  effect:
    "[Main] All of your Characters with 4000 base power or less gain +1000 power until the end of your opponent's next End Phase.\n[Counter] Your Leader gains +3000 power during this battle.",
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
                  filter: "basePower",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            value: 1000,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: localEb05FightAndDieWithMe009I18n,
};
