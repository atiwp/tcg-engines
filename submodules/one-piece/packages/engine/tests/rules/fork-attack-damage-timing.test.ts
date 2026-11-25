// OP Practice fork fix 10 (user-approved 2026-11-25), see FORK-CHANGES.md. Official Q&A
// (qa_op03.pdf):
// 1. OP03-040 / -041 / -043 / -047 / -051: "First, your opponent checks their Life in accordance
//    with the damage dealt, and then this ... effect activates. After that, if the checked Life
//    card has a [Trigger], your opponent can choose to activate it." (P-117 Nami has OP03-040's
//    text.) The engine queued the [Trigger] first.
// 2. OP03-001 Portgas.D.Ace: "When this Leader ... is attacked" activates after the [Blocker]
//    step; if a [Blocker] is activated that Character becomes the target and the effect cannot
//    be used. Attacking, Ace's effect still resolves before the opponent's [Blocker] and Counter.
import {
  eb01Blueno017,
  eb02Komei034,
  op02ParadiseTotsuka047,
  op03BellMere051,
  op03Gaimon043,
  op03Nami040,
  op03PortgasDAce001,
  op03Usopp041,
  op03Zeff047,
  pNami117,
  st06GreatEruption015,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;
const NORTH_ATTACKS = { firstPlayer: "south", activeSeat: "north" } as const;

/** Pending prompts as "seat:intent", oldest first. */
const pending = (e: OnePieceTestEngine) =>
  e
    .getState()
    .promptQueue.filter((p) => p.status === "pending")
    .map((p) => `${p.seat}:${p.resolutionContext?.intent}`);

const deck = (n: number) => Array.from({ length: n }, () => eb02Komei034);
const KOMEI_LIFE = [eb02Komei034, eb02Komei034, eb02Komei034];

type DamageCard = {
  name: string;
  card: { id: string };
  leader: boolean;
  don: number;
  /** Gaimon reacts to any of our attacks: it stays home and our Leader attacks. */
  bystander?: boolean;
};
const damageCards: DamageCard[] = [
  { name: "OP03-040 Nami", card: op03Nami040, leader: true, don: 1 },
  { name: "P-117 Nami", card: pNami117, leader: true, don: 1 },
  { name: "OP03-041 Usopp", card: op03Usopp041, leader: false, don: 1 },
  { name: "OP03-043 Gaimon", card: op03Gaimon043, leader: false, don: 0, bystander: true },
  { name: "OP03-047 Zeff", card: op03Zeff047, leader: false, don: 1 },
  { name: "OP03-051 Bell-mere", card: op03BellMere051, leader: false, don: 1 },
];

function attackWith(c: DamageCard, northLife: Array<{ id: string }>) {
  const south = c.leader
    ? { leaderCardId: c.card, deck: deck(20), activeDon: 3 }
    : { character: [{ card: c.card, playedOnTurn: 0 }], deck: deck(20), activeDon: 3 };
  const e = OnePieceTestEngine.create(south, { life: northLife }, SOUTH_ATTACKS);
  const attackerId = c.leader || c.bystander ? e.leader("south") : e.asSouth().findOnField(c.card);
  if (c.don > 0) e.asSouth().attachDon(attackerId, c.don);
  e.asSouth().attack(attackerId, e.asNorth().leader());
  return e;
}

describe("fork fix 10: the attacker's damage effect comes before the checked Life card's [Trigger]", () => {
  for (const c of damageCards) {
    test(`${c.name}: effect first, then [Trigger] (Paradise Totsuka on top)`, () => {
      const e = attackWith(c, [op02ParadiseTotsuka047, eb02Komei034, eb02Komei034]);
      expect(pending(e)).toEqual(["south:effectOptional"]);
      e.asSouth().acceptOptional();
      expect(pending(e)).toEqual(["north:lifeTrigger"]);
      e.asNorth().declineLifeTrigger();
      expect(pending(e)).toEqual([]);
    });

    test(`${c.name}: a Life card without [Trigger] still gives only the effect`, () => {
      const e = attackWith(c, KOMEI_LIFE);
      expect(pending(e)).toEqual(["south:effectOptional"]);
      e.asSouth().acceptOptional();
      expect(pending(e)).toEqual([]);
      expect(e.getView("south").players.north.lifeCount).toBe(2);
    });
  }

  test("declining the effect still offers the [Trigger] afterwards", () => {
    const e = attackWith(damageCards[2]!, [op02ParadiseTotsuka047, eb02Komei034, eb02Komei034]);
    e.asSouth().declineOptional();
    expect(pending(e)).toEqual(["north:lifeTrigger"]);
  });

  test("OP03-041 Usopp: the effect trashes 7 cards before the [Trigger] is answered", () => {
    const e = attackWith(damageCards[2]!, [op02ParadiseTotsuka047, eb02Komei034, eb02Komei034]);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.trash).toHaveLength(7);
    expect(pending(e)).toEqual(["north:lifeTrigger"]);
  });
});

describe('fork fix 10: OP03-001 Portgas.D.Ace "When this Leader is attacked"', () => {
  const ace = (extra: object = {}) => ({
    leaderCardId: op03PortgasDAce001,
    hand: [st06GreatEruption015, eb02Komei034],
    life: [eb02Komei034, eb02Komei034, eb02Komei034],
    ...extra,
  });
  const attacker = { character: [{ card: eb02Komei034, playedOnTurn: 0 }] };

  test("attacking: Ace's effect resolves before the opponent's [Blocker] choice", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: op03PortgasDAce001, hand: [st06GreatEruption015] },
      { character: [eb01Blueno017] },
      SOUTH_ATTACKS,
    );
    e.asSouth().attack(e.leader("south"), e.asNorth().leader());
    expect(pending(e)).toEqual(["south:effectTrashFromHandSelection"]);
    e.asSouth().trashFromHand(st06GreatEruption015);
    expect(pending(e)).toEqual(["north:battleBlocker"]);
  });

  test("attacked with a [Blocker] available: the Block step comes first", () => {
    const e = OnePieceTestEngine.create(
      ace({ character: [eb01Blueno017] }),
      attacker,
      NORTH_ATTACKS,
    );
    const attackerId = e.asNorth().findOnField(eb02Komei034);
    e.asNorth().attack(attackerId, e.asSouth().leader());
    expect(pending(e)).toEqual(["south:battleBlocker"]);
  });

  test("attacked, no [Blocker] activated: Ace's effect comes after the Block step, before the Counter step", () => {
    const e = OnePieceTestEngine.create(
      ace({ character: [eb01Blueno017] }),
      attacker,
      NORTH_ATTACKS,
    );
    const attackerId = e.asNorth().findOnField(eb02Komei034);
    e.asNorth().attack(attackerId, e.asSouth().leader());
    e.asSouth().chooseBlocker(null);
    expect(pending(e)).toEqual(["south:effectTrashFromHandSelection"]);
    e.asSouth().trashFromHand(st06GreatEruption015);
    expect(e.getState().battle?.step).toBe("counter");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
  });

  test("attacked, a [Blocker] blocks: the attack is redirected and Ace's effect is not offered", () => {
    const e = OnePieceTestEngine.create(
      ace({ character: [eb01Blueno017] }),
      attacker,
      NORTH_ATTACKS,
    );
    const attackerId = e.asNorth().findOnField(eb02Komei034);
    const blockerId = e.asSouth().findOnField(eb01Blueno017);
    e.asNorth().attack(attackerId, e.asSouth().leader());
    e.asSouth().chooseBlocker(blockerId);
    expect(pending(e).filter((p) => p.includes("effectTrashFromHandSelection"))).toEqual([]);
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });

  test("attacked with no [Blocker] on the field: the effect still comes before the Counter step", () => {
    const e = OnePieceTestEngine.create(ace(), attacker, NORTH_ATTACKS);
    const attackerId = e.asNorth().findOnField(eb02Komei034);
    e.asNorth().attack(attackerId, e.asSouth().leader());
    expect(pending(e)).toEqual(["south:effectTrashFromHandSelection"]);
    e.asSouth().trashFromHand(st06GreatEruption015);
    expect(pending(e)).toEqual(["south:battleCounter"]);
  });

  test("an attack on one of our Characters does not use Ace's effect", () => {
    const e = OnePieceTestEngine.create(
      ace({ character: [{ card: eb01Blueno017, rested: true }] }),
      attacker,
      NORTH_ATTACKS,
    );
    const attackerId = e.asNorth().findOnField(eb02Komei034);
    const targetId = e.asSouth().findOnField(eb01Blueno017);
    e.asNorth().attack(attackerId, targetId);
    expect(pending(e).filter((p) => p.includes("effectTrashFromHandSelection"))).toEqual([]);
  });
});
