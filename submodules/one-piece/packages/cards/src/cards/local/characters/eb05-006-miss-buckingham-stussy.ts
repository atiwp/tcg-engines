// OP Practice local card (fork-only). Source: optcgapi.com data, 2026-11-22. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localEb05MissBuckinghamStussy006I18n } from "./eb05-006-miss-buckingham-stussy.i18n.ts";

export const localEb05MissBuckinghamStussy006: CharacterCard = {
  id: "EB05-006",
  canonicalId: "EB05-006",
  slug: "miss-buckingham-stussy/eb05-006",
  name: "Miss Buckingham Stussy",
  printings: [
    {
      id: "EB05-006",
      artId: "EB05-006",
      setCode: "EB05",
      collectorNumber: "006",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB05-006.jpg",
      label: "Miss Buckingham Stussy (EB05-006)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB05",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Rocks Pirates"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] [Once Per Turn] You may add 1 card from the top of your Life cards to your hand: Choose one:\n• Give up to 1 Character +3000 power during this turn.\n• Give up to 1 Character -4000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "modifyPower",
                  target: {
                    player: "any",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: 3000,
                  duration: "thisTurn",
                },
              ],
              [
                {
                  action: "modifyPower",
                  target: {
                    player: "any",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: -4000,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: localEb05MissBuckinghamStussy006I18n,
};
