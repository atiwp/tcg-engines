// OP Practice local card (fork-only). Source: official card list (en.onepiece-cardgame.com), 2026-11-23. No effect text on the official card list: vanilla. See ../LOCAL-CARDS.md.
import type { CharacterCard } from "@tcg/op-types";
import { localOp18TBone073I18n } from "./op18-073-t-bone.i18n.ts";

export const localOp18TBone073: CharacterCard = {
  id: "OP18-073",
  canonicalId: "OP18-073",
  slug: "t-bone/op18-073",
  name: "T-Bone",
  printings: [
    {
      id: "OP18-073",
      artId: "OP18-073",
      setCode: "OP18",
      collectorNumber: "073",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP18-073.png",
      label: "T-Bone (OP18-073)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP18",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Water Seven", "Navy"],
  attribute: "slash",
  i18n: localOp18TBone073I18n,
};
