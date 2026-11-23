// OP Practice local cards (fork-only): command-driven proofs for the black and yellow OP18
// definitions taken from the official card list (packages/cards/src/cards/local/).
// Unsupported clauses: LOCAL-CARDS.md.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../index.ts";

type Engine = OnePieceTestEngine;
type Seat = "south" | "north";

const ids = (cards: ReadonlyArray<{ cardId?: string | null } | null | undefined>) =>
  cards.map((card) => card?.cardId).filter(Boolean);
const byText = (left: string | null | undefined, right: string | null | undefined) =>
  String(left).localeCompare(String(right));
const south = (e: Engine) => e.getView("south").players.south;
const north = (e: Engine) => e.getView("south").players.north;
const powerOf = (e: Engine, seat: Seat, cardId: string) =>
  e.getView("south").players[seat].characters.find((c) => c?.cardId === cardId)?.power;
const pending = (e: Engine, seat: Seat, intent: string) =>
  e
    .getState()
    .promptQueue.some(
      (p) => p.status === "pending" && p.seat === seat && p.resolutionContext?.intent === intent,
    );
const candidates = (
  e: Engine,
  intent: Parameters<Engine["pendingDecision"]>[0],
  seat: Seat = "south",
) => {
  const step = e.pendingDecision(intent, seat).steps.find((s) => s.kind === "selectEntity");
  if (step?.kind !== "selectEntity") throw new Error(`Expected a ${intent} selection.`);
  return step.candidates.filter((c) => c.legal).map((c) => e.getState().cards[c.ref.id]?.cardId);
};

/** The defender declines blockers and counters until the battle resolves. */
function finishBattle(e: Engine, defender: Seat): void {
  for (let i = 0; i < 4; i++) {
    if (pending(e, defender, "battleBlocker")) {
      e.resolveDecision("battleBlocker", { selectedIds: [] }, defender);
    } else if (pending(e, defender, "battleCounter")) {
      e.resolveDecision("battleCounter", { selectedIds: [] }, defender);
    } else return;
  }
}
/** North's 8000-power Character attacks South's rested Character. */
function northKos(e: Engine, target: string): void {
  e.declareAttack(
    e.findCardInZone("north", "character", "EB01-041"),
    e.findCardInZone("south", "character", target),
    "north",
  );
  finishBattle(e, "south");
}
const attacker8000 = { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] };
/** North's Leader hits South's Leader; South activates the [Trigger] of the Life card hit. */
function southTriggers(e: Engine): void {
  e.declareAttack(e.leader("north"), e.leader("south"), "north");
  finishBattle(e, "south");
  e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
}
function keepOrder(e: Engine, intent: "effectSearchRemainderOrder"): void {
  if (!pending(e, "south", intent)) return;
  const step = e.pendingDecision(intent, "south").steps[0];
  if (step?.kind !== "orderItems") throw new Error("Expected an order.");
  e.resolveDecision(intent, { selectedIds: step.candidates.map((c) => c.ref.id) }, "south");
}
const CP_LEADER = "OP18-079";
/** Answer an "up to 1" count prompt with 1 when it is asked. */
function takeOne(e: Engine, intent: "effectAddToLifeFromDeck" | "effectRemoveFromLifeCount"): void {
  if (pending(e, "south", intent)) e.resolveDecision(intent, { optionId: "1" }, "south");
}

describe("OP18-079 Spandam (Leader)", () => {
  test("rest 2 DON!!, this Leader and trash a CP card: the top deck card goes to the top of Life", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, hand: ["OP18-108", "OP01-012"], activeDon: 2, deck: 3 },
      {},
    );
    const life = south(e).lifeCount;
    e.activateMain(e.leader("south"), "south");
    e.accept("south");
    if (pending(e, "south", "effectCostTrashFromHand")) {
      e.choose("effectCostTrashFromHand", ["OP18-108"], "south");
    }
    takeOne(e, "effectAddToLifeFromDeck");
    expect(south(e).lifeCount).toBe(life + 1);
    expect(south(e).deckCount).toBe(2);
    expect(ids(south(e).trash)).toEqual(["OP18-108"]);
    expect(south(e).activeDon).toBe(0);
    expect(south(e).leader?.rested).toBe(true);
  });

  test("declining pays nothing and adds no Life", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-079", hand: ["OP18-108"], activeDon: 2, deck: 3 },
      {},
    );
    const life = south(e).lifeCount;
    e.activateMain(e.leader("south"), "south");
    e.decline("south");
    expect(south(e).lifeCount).toBe(life);
    expect(south(e).deckCount).toBe(3);
    expect(ids(south(e).trash)).toEqual([]);
    expect(south(e).activeDon).toBe(2);
  });
});

describe("OP18-080 Van Augur", () => {
  test("a card trashed from hand by the [Marshall.D.Teach] Leader's effect draws 1", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", character: ["OP18-080"], hand: ["OP01-012"], deck: 5 },
      {},
    );
    e.activateMain(e.leader("south"), "south");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["OP01-012"]);
    expect(south(e).handCount).toBe(1);
    expect(south(e).deckCount).toBe(4);
  });

  test("with another [Van Augur] on the field, nothing is drawn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-081",
        character: ["OP18-080", "OP18-080"],
        hand: ["OP01-012"],
        deck: 5,
      },
      {},
    );
    e.activateMain(e.leader("south"), "south");
    e.accept("south");
    expect(south(e).handCount).toBe(0);
    expect(south(e).deckCount).toBe(5);
  });

  test("a hand trash by a Character's effect does not draw", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-080"], hand: ["OP18-089", "OP01-012"], activeDon: 4, deck: 5 },
      { hand: ["OP01-012"] },
    );
    e.playCard("OP18-089", "south");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["OP01-012"]);
    expect(south(e).handCount).toBe(0);
    expect(south(e).deckCount).toBe(5);
  });

  test("On K.O. draws 1", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-080" }, rested: true }], deck: 5 },
      attacker8000,
      { activeSeat: "north" },
    );
    northKos(e, "OP18-080");
    expect(ids(south(e).trash)).toEqual(["OP18-080"]);
    expect(south(e).handCount).toBe(1);
    expect(south(e).deckCount).toBe(4);
  });
});

describe("OP18-081 Oars", () => {
  test("[Blocker] only while you have a [Gecko Moria] Character", () => {
    const attack = (south: Parameters<typeof OnePieceTestEngine.create>[0]) => {
      const e = OnePieceTestEngine.create(south, attacker8000, { activeSeat: "north" });
      e.declareAttack(
        e.findCardInZone("north", "character", "EB01-041"),
        e.leader("south"),
        "north",
      );
      return pending(e, "south", "battleBlocker");
    };
    expect(attack({ character: ["OP18-081", "OP07-042"] })).toBe(true);
    expect(attack({ character: ["OP18-081"] })).toBe(false);
  });

  test("with [Gecko Moria], an attack by Oars deals 2 damage; without, 1", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-081" }, playedOnTurn: 0 }, "OP07-042"] },
      {},
    );
    const life = north(e).lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "OP18-081"), e.leader("north"), "south");
    finishBattle(e, "north");
    for (const _ of [0, 1]) {
      if (pending(e, "north", "lifeTrigger")) {
        e.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");
      }
    }
    expect(north(e).lifeCount).toBe(life - 2);
    const alone = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-081" }, playedOnTurn: 0 }] },
      {},
    );
    alone.declareAttack(
      alone.findCardInZone("south", "character", "OP18-081"),
      alone.leader("north"),
      "south",
    );
    finishBattle(alone, "north");
    if (pending(alone, "north", "lifeTrigger")) {
      alone.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");
    }
    expect(north(alone).lifeCount).toBe(life - 1);
  });

  test("[Trigger] plays a cost ≤4 {Thriller Bark Pirates} Character from trash rested", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-081"], trash: ["EB02-046", "OP07-042"] },
      {},
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(candidates(e, "effectPlaySelection")).toEqual(["EB02-046"]);
    e.choose("effectPlaySelection", ["EB02-046"], "south");
    const played = south(e).characters.find((c) => c?.cardId === "EB02-046");
    expect(played?.rested).toBe(true);
  });
});

describe("OP18-082 Catarina Devon", () => {
  test("When Attacking, her base power becomes the opponent's Leader's power", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-082" }, playedOnTurn: 0 }] },
      { leaderCardId: "OP09-081" },
    );
    expect(powerOf(e, "south", "OP18-082")).toBe(3000);
    e.declareAttack(e.findCardInZone("south", "character", "OP18-082"), e.leader("north"), "south");
    expect(powerOf(e, "south", "OP18-082")).toBe(north(e).leader?.power);
    expect(powerOf(e, "south", "OP18-082")).toBe(5000);
  });

  test("On K.O., trash 1: with a {Blackbeard Pirates} Leader she returns from trash rested", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-081",
        character: [{ card: { id: "OP18-082" }, rested: true }],
        hand: ["OP01-012"],
      },
      attacker8000,
      { activeSeat: "north" },
    );
    northKos(e, "OP18-082");
    e.accept("south");
    if (pending(e, "south", "effectPlaySelection")) {
      e.choose("effectPlaySelection", ["OP18-082"], "south");
    }
    expect(ids(south(e).trash)).toEqual(["OP01-012"]);
    expect(south(e).characters.find((c) => c?.cardId === "OP18-082")?.rested).toBe(true);
  });

  test("declining the On K.O. keeps the hand and leaves her in the trash", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-081",
        character: [{ card: { id: "OP18-082" }, rested: true }],
        hand: ["OP01-012"],
      },
      attacker8000,
      { activeSeat: "north" },
    );
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "OP18-082"),
      "north",
    );
    finishBattle(e, "south");
    e.decline("south");
    expect(ids(south(e).trash)).toEqual(["OP18-082"]);
    expect(ids(south(e).hand)).toEqual(["OP01-012"]);
  });

  test("with another Leader the trash is paid but she stays in the trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-082" }, rested: true }], hand: ["OP01-012"] },
      attacker8000,
      { activeSeat: "north" },
    );
    northKos(e, "OP18-082");
    e.accept("south");
    expect(ids(south(e).trash).sort(byText)).toEqual(["OP01-012", "OP18-082"]);
    expect(ids(south(e).characters)).toEqual([]);
  });
});

describe("OP18-086 Goldberg", () => {
  test("gains +12 cost; On K.O. K.O.s an opponent's cost ≤4 Character", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-086" }, rested: true }] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }, "EB02-046", "OP07-042"] },
      { activeSeat: "north" },
    );
    const goldberg = e.findCardInZone("south", "character", "OP18-086");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === goldberg),
    ).toMatchObject({ cost: 15 });
    northKos(e, "OP18-086");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB02-046"]);
    e.choose("effectTargetSelection", ["EB02-046"], "south");
    expect(ids(north(e).trash)).toEqual(["EB02-046"]);
  });
});

describe("OP18-087 Stansen", () => {
  test("+2000 while all your Characters cost 12 or more; not with a cheaper Character", () => {
    const giants = OnePieceTestEngine.create({ character: ["OP18-087", "OP18-086"] }, {});
    expect(powerOf(giants, "south", "OP18-087")).toBe(6000);
    const mixed = OnePieceTestEngine.create({ character: ["OP18-087", "OP01-012"] }, {});
    expect(powerOf(mixed, "south", "OP18-087")).toBe(4000);
  });
});

describe("OP18-089 Dorry", () => {
  test("On Play, trash 1: the opponent trashes 1 from hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-089", "OP01-012"], activeDon: 4 },
      { hand: ["EB02-046"] },
    );
    e.playCard("OP18-089", "south");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["OP01-012"]);
    expect(north(e).handCount).toBe(0);
    expect(ids(north(e).trash)).toEqual(["EB02-046"]);
  });

  test("declining keeps both hands", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-089", "OP01-012"], activeDon: 4 },
      { hand: ["EB02-046"] },
    );
    e.playCard("OP18-089", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["OP01-012"]);
    expect(north(e).handCount).toBe(1);
  });
});

describe("OP18-090 Brook (no text on the official card list: vanilla)", () => {
  test("plays as a 7-cost 9000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-090"], activeDon: 7 }, {});
    e.playCard("OP18-090", "south");
    expect(powerOf(e, "south", "OP18-090")).toBe(9000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("OP18-091 Brogy", () => {
  test("When Attacking, trash 1: a cost ≤2 Character returns from trash to hand", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP18-091" }, playedOnTurn: 0 }],
        hand: ["OP01-012"],
        trash: ["OP18-108", "EB02-046"],
      },
      {},
    );
    e.declareAttack(e.findCardInZone("south", "character", "OP18-091"), e.leader("north"), "south");
    e.accept("south");
    // OP01-012 (cost 2, just trashed as the cost) is a legal choice too; EB02-046 (cost 3) is not.
    expect(candidates(e, "effectTargetSelection").sort(byText)).toEqual(["OP01-012", "OP18-108"]);
    e.choose("effectTargetSelection", ["OP18-108"], "south");
    expect(ids(south(e).hand)).toEqual(["OP18-108"]);
    expect(ids(south(e).trash).sort(byText)).toEqual(["EB02-046", "OP01-012"]);
  });

  test("declining keeps the hand and the trash", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP18-091" }, playedOnTurn: 0 }],
        hand: ["OP01-012"],
        trash: ["OP18-108"],
      },
      {},
    );
    e.declareAttack(e.findCardInZone("south", "character", "OP18-091"), e.leader("north"), "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["OP01-012"]);
    expect(ids(south(e).trash)).toEqual(["OP18-108"]);
  });
});

describe("OP18-092 Roronoa Zoro", () => {
  test("+3000 while any Character costs 12 or more, on either side", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-092"] }, { character: ["OP18-086"] });
    expect(powerOf(e, "south", "OP18-092")).toBe(5000);
    const none = OnePieceTestEngine.create({ character: ["OP18-092"] }, {});
    expect(powerOf(none, "south", "OP18-092")).toBe(2000);
  });

  test("[Rush] with 10 or more cards in trash: attacks the turn it is played", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-092"], activeDon: 2, trash: 10 }, {});
    e.playCard("OP18-092", "south");
    e.declareAttack(e.findCardInZone("south", "character", "OP18-092"), e.leader("north"), "south");
    expect(south(e).characters.find((c) => c?.cardId === "OP18-092")?.rested).toBe(true);
  });

  test("without 10 cards in trash it cannot attack the turn it is played", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-092"], activeDon: 2, trash: 9 }, {});
    e.playCard("OP18-092", "south");
    expect(() =>
      e.declareAttack(
        e.findCardInZone("south", "character", "OP18-092"),
        e.leader("north"),
        "south",
      ),
    ).toThrow();
    expect(south(e).characters.find((c) => c?.cardId === "OP18-092")?.rested).toBe(false);
  });
});

describe("OP18-094 Hee Hee Hee!! I Smell Adventure!!", () => {
  test("looks at 5 and adds an {Elbaph} card; the rest go to the bottom", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["OP18-094"],
        activeDon: 1,
        deck: ["OP18-091", "OP01-012", "EB02-046", "OP18-108", "OP18-090", "OP18-098"],
      },
      {},
    );
    e.playCard("OP18-094", "south");
    expect(candidates(e, "effectSearchSelection")).toEqual(["OP18-091"]);
    e.choose("effectSearchSelection", ["OP18-091"], "south");
    keepOrder(e, "effectSearchRemainderOrder");
    expect(ids(south(e).hand)).toEqual(["OP18-091"]);
    expect(south(e).deckCount).toBe(5);
  });

  test("[Trigger] draws 1", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-094"], deck: 3 },
      {},
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(south(e).handCount).toBe(1);
    expect(south(e).deckCount).toBe(2);
  });
});

// Yellow: the "Leader's type includes CP" [Trigger]s are proven with the OP18-079 Spandam Leader.

describe("OP18-098 Onigumo", () => {
  test("[Unblockable]: the opponent's Blocker is not offered", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-098" }, playedOnTurn: 0 }] },
      { character: ["OP18-112"] },
    );
    e.declareAttack(e.findCardInZone("south", "character", "OP18-098"), e.leader("north"), "south");
    expect(pending(e, "north", "battleBlocker")).toBe(false);
  });
});

describe("OP18-112 Yamakaji", () => {
  test("[Blocker] can redirect an attack", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { card: { id: "OP18-098" }, playedOnTurn: 0 },
          { card: { id: "OP18-111" }, playedOnTurn: 0 },
        ],
      },
      { character: ["OP18-112"] },
    );
    e.declareAttack(e.findCardInZone("south", "character", "OP18-111"), e.leader("north"), "south");
    expect(pending(e, "north", "battleBlocker")).toBe(true);
  });
});

describe("OP18-099 Kaku", () => {
  test("On Play adds a CP card from hand to the bottom of Life face-up", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-099", "OP18-107", "OP01-012"], activeDon: 7 },
      {},
    );
    const life = south(e).lifeCount;
    e.playCard("OP18-099", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP18-107"]);
    e.choose("effectTargetSelection", ["OP18-107"], "south");
    e.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");
    expect(south(e).lifeCount).toBe(life + 1);
    expect(ids(south(e).hand)).toEqual(["OP01-012"]);
    const lifeCards = e.getView("north").players.south.life;
    expect(lifeCards.at(-1)?.cardId).toBe("OP18-107");
  });

  test("[Trigger] with a CP Leader: draw 1 and a cost ≤8 Character goes to the bottom of its owner's deck", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-099"], deck: 3 },
      { character: ["OP18-090", "OP18-113"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(south(e).handCount).toBe(1);
    expect(candidates(e, "effectTargetSelection").sort(byText)).toEqual(["OP18-090", "OP18-113"]);
    e.choose("effectTargetSelection", ["OP18-113"], "south");
    expect(ids(north(e).characters)).toEqual(["OP18-090"]);
    expect(ids(north(e).trash)).toEqual([]);
  });

  test("[Trigger] does nothing with a non-CP Leader", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-099"], deck: 3 },
      { character: ["OP18-113"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(south(e).handCount).toBe(0);
    expect(ids(north(e).characters)).toEqual(["OP18-113"]);
  });
});

describe("OP18-100 Kalifa", () => {
  test("On Play draws 1, then adds a CP card from hand to the top of Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-100", "OP18-107"], activeDon: 6, deck: 3 },
      {},
    );
    const life = south(e).lifeCount;
    e.playCard("OP18-100", "south");
    e.choose("effectTargetSelection", ["OP18-107"], "south");
    e.resolveDecision("effectLifePosition", { optionId: "top" }, "south");
    expect(south(e).lifeCount).toBe(life + 1);
    expect(south(e).deckCount).toBe(2);
    expect(e.getView("north").players.south.life[0]?.cardId).toBe("OP18-107");
  });

  test("[Trigger] with a CP Leader: draw 1 and rest the opponent's Leader", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-100"], deck: 3 },
      {},
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(south(e).handCount).toBe(1);
    if (pending(e, "south", "effectTargetSelection")) {
      e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "south");
    }
    expect(north(e).leader?.rested).toBe(true);
  });
});

describe("OP18-101 Kumadori", () => {
  test("On K.O. adds a CP card from hand to Life", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-101" }, rested: true }], hand: ["OP18-107"] },
      attacker8000,
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    northKos(e, "OP18-101");
    e.choose("effectTargetSelection", ["OP18-107"], "south");
    e.resolveDecision("effectLifePosition", { optionId: "top" }, "south");
    expect(south(e).lifeCount).toBe(life + 1);
    expect(south(e).handCount).toBe(0);
  });

  test("[Trigger] with a CP Leader: K.O. or rest a cost ≤6 Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-101"] },
      { character: ["EB02-046", "OP18-090"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    const step = e.pendingDecision("effectActionChoice", "south").steps[0];
    if (step?.kind !== "chooseOption") throw new Error("Expected a choice.");
    e.resolveDecision("effectActionChoice", { optionId: step.options[0]!.id }, "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB02-046"]);
    e.choose("effectTargetSelection", ["EB02-046"], "south");
    expect(ids(north(e).trash)).toEqual(["EB02-046"]);
  });
});

describe("OP18-102 Jerry (no text on the official card list: vanilla)", () => {
  test("plays as a 4-cost 6000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-102"], activeDon: 4 }, {});
    e.playCard("OP18-102", "south");
    expect(powerOf(e, "south", "OP18-102")).toBe(6000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("OP18-103 Jabra", () => {
  test("On K.O. adds the top deck card to Life, then trashes the opponent's top Life card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-103" }, rested: true }], deck: 3 },
      attacker8000,
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const oppLife = north(e).lifeCount;
    northKos(e, "OP18-103");
    takeOne(e, "effectAddToLifeFromDeck");
    takeOne(e, "effectRemoveFromLifeCount");
    expect(south(e).lifeCount).toBe(life + 1);
    expect(south(e).deckCount).toBe(2);
    expect(north(e).lifeCount).toBe(oppLife - 1);
    expect(north(e).trash).toHaveLength(1);
  });

  test("[Trigger] with a CP Leader: draw 1 and bottom-deck a cost ≤8 Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-103"], deck: 3 },
      { character: ["OP18-113"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    e.choose("effectTargetSelection", ["OP18-113"], "south");
    expect(south(e).handCount).toBe(1);
    expect(ids(north(e).characters)).toEqual([]);
  });
});

describe("OP18-104 Strawberry", () => {
  test("[Banish]: the Life card hit is trashed and its [Trigger] is not offered", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-104" }, playedOnTurn: 0 }] },
      { life: ["OP18-094", "OP01-012"] },
    );
    e.declareAttack(e.findCardInZone("south", "character", "OP18-104"), e.leader("north"), "south");
    finishBattle(e, "north");
    expect(pending(e, "north", "lifeTrigger")).toBe(false);
    expect(ids(north(e).trash)).toEqual(["OP18-094"]);
    expect(north(e).handCount).toBe(0);
  });
});

describe("OP18-105 Spandam", () => {
  test("[Trigger] with a CP Leader activates the [Trigger] of a CP card in hand, which stays in hand", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-105"], hand: ["OP18-115", "OP18-108"], deck: 3 },
      { character: ["OP18-090"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    // Ten Finger Pistol has a [Trigger]; Funkfreed is CP but has none; [Spandam] is excluded.
    expect(candidates(e, "effectTargetSelection").sort(byText)).toEqual(["OP18-108", "OP18-115"]);
    e.choose("effectTargetSelection", ["OP18-115"], "south");
    // Ten Finger Pistol's [Trigger]: draw 1 and bottom-deck a cost ≤7 Character.
    expect(south(e).handCount).toBe(3);
    e.choose("effectTargetSelection", ["OP18-090"], "south");
    expect(ids(north(e).characters)).toEqual([]);
    expect(ids(south(e).hand)).toContain("OP18-115");
    expect(JSON.stringify(e.getView("north"))).toContain("OP18-115");
  });

  test("[Trigger] does nothing with a non-CP Leader", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-105"], hand: ["OP18-115"], deck: 3 },
      { character: ["OP18-113"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(pending(e, "south", "effectTargetSelection")).toBe(false);
    expect(south(e).handCount).toBe(1);
  });
});

describe("OP18-106 Doberman", () => {
  test("[Double Attack] deals 2 damage", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-106" }, playedOnTurn: 0 }] },
      {},
    );
    const life = north(e).lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "OP18-106"), e.leader("north"), "south");
    finishBattle(e, "north");
    for (const _ of [0, 1]) {
      if (pending(e, "north", "lifeTrigger")) {
        e.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");
      }
    }
    expect(north(e).lifeCount).toBe(life - 2);
  });
});

describe("OP18-107 Nero", () => {
  test("[Trigger] with a CP Leader bottom-decks a cost ≤5 Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-107"] },
      { character: ["EB02-046", "OP18-090"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB02-046"]);
    e.choose("effectTargetSelection", ["EB02-046"], "south");
    expect(ids(north(e).characters)).toEqual(["OP18-090"]);
  });
});

describe("OP18-108 Funkfreed", () => {
  test("On Play, trash a CP card: draw 2", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-108", "OP18-107"], activeDon: 1, deck: 4 },
      {},
    );
    e.playCard("OP18-108", "south");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["OP18-107"]);
    expect(south(e).handCount).toBe(2);
    expect(south(e).deckCount).toBe(2);
  });

  test("declining the On Play keeps the hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-108", "OP18-107"], activeDon: 1, deck: 4 },
      {},
    );
    e.playCard("OP18-108", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["OP18-107"]);
    expect(south(e).deckCount).toBe(4);
  });

  test("rest this: a [Spandam] gains +1000 this turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, character: ["OP18-108", "OP18-105"] },
      {},
    );
    e.activateMain(e.findCardInZone("south", "character", "OP18-108"), "south");
    e.accept("south");
    if (pending(e, "south", "effectTargetSelection")) {
      e.choose("effectTargetSelection", ["OP18-105"], "south");
    }
    expect(powerOf(e, "south", "OP18-105")).toBe(2000);
    expect(south(e).characters.find((c) => c?.cardId === "OP18-108")?.rested).toBe(true);
  });

  test("declining the [Activate: Main] keeps it active", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, character: ["OP18-108", "OP18-105"] },
      {},
    );
    e.activateMain(e.findCardInZone("south", "character", "OP18-108"), "south");
    e.decline("south");
    expect(south(e).characters.find((c) => c?.cardId === "OP18-108")?.rested).toBe(false);
    expect(powerOf(e, "south", "OP18-105")).toBe(1000);
  });
});

describe("OP18-109 Fukurou", () => {
  test("[Trigger] with a CP Leader can rest a cost ≤6 Character instead", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-109"] },
      { character: ["EB02-046"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    const step = e.pendingDecision("effectActionChoice", "south").steps[0];
    if (step?.kind !== "chooseOption") throw new Error("Expected a choice.");
    e.resolveDecision("effectActionChoice", { optionId: step.options[1]!.id }, "south");
    e.choose("effectTargetSelection", ["EB02-046"], "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB02-046")?.rested).toBe(true);
  });
});

describe("OP18-110 Blueno", () => {
  test("On Play looks at 4 and adds a CP card other than [Blueno]", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["OP18-110"],
        activeDon: 1,
        deck: ["OP18-110", "OP18-107", "OP01-012", "OP18-108", "OP18-090"],
      },
      {},
    );
    e.playCard("OP18-110", "south");
    expect(candidates(e, "effectSearchSelection").sort(byText)).toEqual(["OP18-107", "OP18-108"]);
    e.choose("effectSearchSelection", ["OP18-107"], "south");
    keepOrder(e, "effectSearchRemainderOrder");
    expect(ids(south(e).hand)).toEqual(["OP18-107"]);
  });

  test("[Trigger] draws 1 and K.O.s a cost ≤2 Character", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-110"], deck: 3 },
      { character: ["OP18-108", "EB02-046"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(south(e).handCount).toBe(1);
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP18-108"]);
    e.choose("effectTargetSelection", ["OP18-108"], "south");
    expect(ids(north(e).trash)).toEqual(["OP18-108"]);
  });
});

describe("OP18-111 Momonga", () => {
  test("[Rush]: attacks the turn it is played", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-111"], activeDon: 7 }, {});
    e.playCard("OP18-111", "south");
    const life = north(e).lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "OP18-111"), e.leader("north"), "south");
    finishBattle(e, "north");
    if (pending(e, "north", "lifeTrigger")) {
      e.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");
    }
    expect(north(e).lifeCount).toBe(life - 1);
  });
});

describe("OP18-113 Rob Lucci", () => {
  test("On Play trashes the opponent's top Life card", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-113"], activeDon: 8 }, {});
    const oppLife = north(e).lifeCount;
    e.playCard("OP18-113", "south");
    takeOne(e, "effectRemoveFromLifeCount");
    expect(north(e).lifeCount).toBe(oppLife - 1);
    expect(north(e).trash).toHaveLength(1);
  });

  test("On K.O. trashes the opponent's top Life card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-113" }, rested: true }] },
      { character: [{ card: { id: "OP18-081" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const oppLife = north(e).lifeCount;
    e.declareAttack(
      e.findCardInZone("north", "character", "OP18-081"),
      e.findCardInZone("south", "character", "OP18-113"),
      "north",
    );
    finishBattle(e, "south");
    takeOne(e, "effectRemoveFromLifeCount");
    expect(ids(south(e).trash)).toEqual(["OP18-113"]);
    expect(north(e).lifeCount).toBe(oppLife - 1);
  });

  test("[Trigger] with a CP Leader: draw 1 and bottom-deck a cost ≤8 Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-113"], deck: 3 },
      { character: ["OP18-090"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    e.choose("effectTargetSelection", ["OP18-090"], "south");
    expect(south(e).handCount).toBe(1);
    expect(ids(north(e).characters)).toEqual([]);
  });
});

describe("OP18-114 Wanze", () => {
  test("On Play looks at all Life cards and puts them back in any order", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-114"], activeDon: 3, life: ["OP18-098", "OP18-104", "OP18-106"] },
      {},
    );
    e.playCard("OP18-114", "south");
    const step = e.pendingDecision("effectRearrangeLifeOrder", "south").steps[0];
    if (step?.kind !== "orderItems") throw new Error("Expected an order.");
    const order = step.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectRearrangeLifeOrder", { selectedIds: order }, "south");
    const life = e.getState().players.south.life.map((id) => e.getState().cards[id]?.cardId);
    expect(life).toEqual(order.map((id) => e.getState().cards[id]?.cardId));
    expect(south(e).lifeCount).toBe(3);
  });

  test("[Trigger] with a CP Leader bottom-decks a cost ≤5 Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-114"] },
      { character: ["EB02-046"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    e.choose("effectTargetSelection", ["EB02-046"], "south");
    expect(ids(north(e).characters)).toEqual([]);
  });
});

describe("OP18-115 Ten Finger Pistol", () => {
  test("[Main] K.O.s an opponent's cost ≤5 Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-115"], activeDon: 4 },
      { character: ["EB02-046", "OP18-090"] },
    );
    e.playCard("OP18-115", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB02-046"]);
    e.choose("effectTargetSelection", ["EB02-046"], "south");
    expect(ids(north(e).trash)).toEqual(["EB02-046"]);
  });

  test("[Trigger] with a CP Leader: draw 1 and bottom-deck a cost ≤7 Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-115"], deck: 3 },
      { character: ["OP18-090", "OP18-113"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP18-090"]);
    e.choose("effectTargetSelection", ["OP18-090"], "south");
    expect(south(e).handCount).toBe(1);
    expect(ids(north(e).characters)).toEqual(["OP18-113"]);
  });
});

describe("OP18-116 Iron Body Empty Tree", () => {
  test("[Counter], trash 1: +3000 to the Leader for the battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-116", "OP01-012"] },
      {},
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    const eventId = e.findCardInZone("south", "hand", "OP18-116");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.accept("south");
    if (pending(e, "south", "effectCostTrashFromHand")) {
      e.choose("effectCostTrashFromHand", ["OP01-012"], "south");
    }
    if (pending(e, "south", "effectTargetSelection")) {
      e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    }
    finishBattle(e, "south");
    expect(south(e).lifeCount).toBe(life);
    expect(ids(south(e).trash).sort(byText)).toEqual(["OP01-012", "OP18-116"]);
  });

  test("declining the [Counter] cost keeps the hand and gives no power", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-116", "OP01-012"] },
      {},
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    const eventId = e.findCardInZone("south", "hand", "OP18-116");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.decline("south");
    finishBattle(e, "south");
    if (pending(e, "south", "lifeTrigger")) {
      e.resolveDecision("lifeTrigger", { optionId: "skip" }, "south");
    }
    expect(ids(south(e).hand)).toContain("OP01-012");
    expect(ids(south(e).trash)).toEqual(["OP18-116"]);
    expect(south(e).lifeCount).toBe(life - 1);
  });

  test("[Trigger] with a CP Leader rests an opponent's Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, life: ["OP18-116"] },
      { character: ["OP18-090"] },
      { activeSeat: "north" },
    );
    southTriggers(e);
    e.choose("effectTargetSelection", ["OP18-090"], "south");
    expect(north(e).characters.find((c) => c?.cardId === "OP18-090")?.rested).toBe(true);
  });
});

describe("OP18-117 Buster Call", () => {
  test("with [Spandam]: trash all Life and all Characters, play up to 5 differently named {Vice Admiral}s from deck or trash", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: CP_LEADER,
        hand: ["OP18-117"],
        activeDon: 10,
        deck: ["OP18-098", "OP18-104", "OP18-098", "OP01-012"],
        trash: ["OP18-106", "OP18-111"],
        character: ["OP01-012"],
      },
      { character: ["OP18-090"] },
    );
    e.playCard("OP18-117", "south");
    e.accept("south");
    expect(south(e).lifeCount).toBe(0);
    expect(ids(north(e).characters)).toEqual([]);
    expect(ids(north(e).trash)).toEqual(["OP18-090"]);
    expect(candidates(e, "effectPlaySelection").sort(byText)).toEqual([
      "OP18-098",
      "OP18-098",
      "OP18-104",
      "OP18-106",
      "OP18-111",
    ]);
    const decision = e.pendingDecision("effectPlaySelection", "south");
    const step = decision.steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected a play selection.");
    const pick = (cardId: string) =>
      step.candidates.find((c) => e.getState().cards[c.ref.id]?.cardId === cardId)!.ref.id;
    e.resolveDecision(
      "effectPlaySelection",
      { selectedIds: ["OP18-098", "OP18-104", "OP18-106", "OP18-111"].map(pick) },
      "south",
    );
    expect(ids(south(e).characters).sort(byText)).toEqual([
      "OP18-098",
      "OP18-104",
      "OP18-106",
      "OP18-111",
    ]);
    expect(south(e).deckCount).toBe(2);
  });

  test("two cards with the same name cannot both be played", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: CP_LEADER,
        hand: ["OP18-117"],
        activeDon: 10,
        deck: ["OP18-098", "OP18-098"],
      },
      {},
    );
    e.playCard("OP18-117", "south");
    e.accept("south");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected a play selection.");
    expect(() =>
      e.resolveDecision(
        "effectPlaySelection",
        { selectedIds: step.candidates.map((c) => c.ref.id) },
        "south",
      ),
    ).toThrow();
    expect(ids(south(e).characters)).toEqual([]);
  });

  test("with another Leader the Life cards are trashed and nothing else happens", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-117"], activeDon: 10, deck: ["OP18-098"], character: ["OP01-012"] },
      { character: ["OP18-090"] },
    );
    e.playCard("OP18-117", "south");
    e.accept("south");
    expect(south(e).lifeCount).toBe(0);
    expect(ids(south(e).characters)).toEqual(["OP01-012"]);
    expect(ids(north(e).characters)).toEqual(["OP18-090"]);
  });

  test("declining keeps the Life cards and the Characters", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: CP_LEADER, hand: ["OP18-117"], activeDon: 10, character: ["OP01-012"] },
      { character: ["OP18-090"] },
    );
    const life = south(e).lifeCount;
    e.playCard("OP18-117", "south");
    e.decline("south");
    expect(south(e).lifeCount).toBe(life);
    expect(ids(south(e).characters)).toEqual(["OP01-012"]);
    expect(ids(north(e).characters)).toEqual(["OP18-090"]);
  });
});
