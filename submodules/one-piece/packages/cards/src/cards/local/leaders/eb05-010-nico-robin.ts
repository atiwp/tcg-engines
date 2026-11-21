// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-21. See ../LOCAL-CARDS.md.
import type { LeaderCard } from "@tcg/op-types";
import { localEb05NicoRobin010I18n } from "./eb05-010-nico-robin.i18n.ts";

export const localEb05NicoRobin010: LeaderCard = {
  id: "EB05-010",
  canonicalId: "EB05-010",
  slug: "nico-robin/eb05-010",
  name: "Nico Robin",
  printings: [
    {
      id: "EB05-010",
      artId: "EB05-010",
      setCode: "EB05",
      collectorNumber: "010",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-010.jpg",
      label: "Nico Robin (EB05-010)",
    },
  ],
  cardType: "leader",
  color: ["green", "yellow"],
  rarity: "L",
  setId: "EB05",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    '[Once Per Turn] When one of your Characters with the "Wisdom" attribute and without [Blocker] is K.O.\'d, add up to 1 card from the top of your deck to the top of your Life cards. [Activate: Main] [Once Per Turn] Set up to 1 of your Characters with the "Wisdom" attribute and 6000 power or less as active.',
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        eventFilter: {
          player: "self",
          filters: [
            {
              filter: "attribute",
              value: "wisdom",
            },
          ],
        },
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "attribute",
                  value: "wisdom",
                },
                {
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: localEb05NicoRobin010I18n,
};
