// OP Practice local cards (fork-only): command-driven proofs for the OP18 definitions taken from
// the official card list (packages/cards/src/cards/local/). Unsupported clauses: LOCAL-CARDS.md.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../index.ts";

type Engine = OnePieceTestEngine;
type Seat = "south" | "north";

const ids = (cards: ReadonlyArray<{ cardId?: string | null } | null | undefined>) =>
  cards.map((card) => card?.cardId);
const byText = (left: string | null | undefined, right: string | null | undefined) =>
  String(left).localeCompare(String(right));
const candidates = (
  e: Engine,
  intent: Parameters<Engine["pendingDecision"]>[0],
  seat: Seat = "south",
) => {
  const step = e.pendingDecision(intent, seat).steps.find((s) => s.kind === "selectEntity");
  if (step?.kind !== "selectEntity") throw new Error(`Expected a ${intent} selection.`);
  return step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId);
};
const south = (e: Engine) => e.getView("south").players.south;
const north = (e: Engine) => e.getView("south").players.north;
const powerOf = (e: Engine, seat: Seat, cardId: string) =>
  e.getView("south").players[seat].characters.find((c) => c?.cardId === cardId)?.power;
/** Keywords granted to a field card, read from the engine's modifiers. */
const hasGranted = (e: Engine, instanceId: string, keyword: string) =>
  Object.values(e.getState().modifiers).some(
    (m) => JSON.stringify(m).includes(instanceId) && JSON.stringify(m).includes(`"${keyword}"`),
  );
const pending = (e: Engine, seat: Seat, intent: string) =>
  e
    .getState()
    .promptQueue.some(
      (p) => p.status === "pending" && p.seat === seat && p.resolutionContext?.intent === intent,
    );

/** North's 8000-power Character attacks South's rested Character. */
function northKos(e: Engine, target: string): void {
  e.declareAttack(
    e.findCardInZone("north", "character", "EB01-041"),
    e.findCardInZone("south", "character", target),
    "north",
  );
  if (pending(e, "south", "battleCounter")) {
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
  }
}
const attacker8000 = { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] };

describe("OP18-001 Karoo (Leader)", () => {
  test("Animal+Alabasta Characters gain [Rush] and +1000; other Characters do not", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-001", character: ["OP18-003", "OP18-002"] },
      {},
    );
    expect(powerOf(e, "south", "OP18-003")).toBe(7000);
    expect(powerOf(e, "south", "OP18-002")).toBe(2000);
    const seaCat = e.findCardInZone("south", "character", "OP18-003");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === seaCat),
    ).toBeDefined();
  });

  test("once per turn, an Alabasta Character K.O.'d draws 1", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP18-001",
        character: [
          { card: { id: "OP18-003" }, rested: true },
          { card: { id: "OP18-002" }, rested: true },
        ],
        deck: 5,
      },
      {
        character: [
          { card: { id: "EB01-041" }, playedOnTurn: 0 },
          { card: { id: "EB01-055" }, playedOnTurn: 0 },
        ],
      },
      { activeSeat: "north" },
    );
    northKos(e, "OP18-003");
    expect(south(e).hand).toHaveLength(1);
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-055"),
      e.findCardInZone("south", "character", "OP18-002"),
      "north",
    );
    if (pending(e, "south", "battleCounter")) {
      e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    }
    expect(ids(south(e).trash).sort(byText)).toEqual(["OP18-002", "OP18-003"]);
    expect(south(e).hand).toHaveLength(1);
  });
});

describe("OP18-002 Igaram", () => {
  test("On Play: trash an Alabasta card from hand to draw 2", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-002", "OP18-003"], deck: 4, activeDon: 1 },
      {},
    );
    e.playCard("OP18-002", "south");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["OP18-003"]);
    expect(south(e).hand).toHaveLength(2);
    expect(south(e).deckCount).toBe(2);
  });

  test("declining keeps the hand and draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-002", "OP18-003"], deck: 4, activeDon: 1 },
      {},
    );
    e.playCard("OP18-002", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["OP18-003"]);
    expect(south(e).deckCount).toBe(4);
  });
});

describe("OP18-003 Sea Cat (no text on the official card list: vanilla)", () => {
  test("plays as a 5-cost 6000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-003"], activeDon: 5 }, {});
    e.playCard("OP18-003", "south");
    expect(powerOf(e, "south", "OP18-003")).toBe(6000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("OP18-004 Karoo", () => {
  test("gains [Rush] at 5000, [Banish] at 6000 and [Unblockable] at 7000 power", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-004"], activeDon: 3 }, {});
    const karoo = e.findCardInZone("south", "character", "OP18-004");
    const keywords = () =>
      e.getView("south").players.south.characters.find((c) => c?.instanceId === karoo);
    expect(powerOf(e, "south", "OP18-004")).toBe(4000);
    expect(JSON.stringify(keywords())).not.toMatch(/rush|banish|unblockable/i);
    e.attachDon(karoo, 1, "south");
    expect(powerOf(e, "south", "OP18-004")).toBe(5000);
    e.attachDon(karoo, 2, "south");
    expect(powerOf(e, "south", "OP18-004")).toBe(7000);
  });

  test("with 5000+ power it can attack the turn it is played", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-001", hand: ["OP18-004"], activeDon: 3 },
      {},
    );
    e.playCard("OP18-004", "south");
    expect(powerOf(e, "south", "OP18-004")).toBe(5000);
    const life = north(e).lifeCount;
    e.attack("OP18-004", e.leader("north"), "south");
    expect(north(e).lifeCount).toBe(life - 1);
  });

  test("below 5000 power it cannot attack the turn it is played", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-004"], activeDon: 3 }, {});
    e.playCard("OP18-004", "south");
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: e.findCardInZone("south", "character", "OP18-004"),
        targetId: e.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});

describe("OP18-005 Kung Fu Jugon", () => {
  test("Your Turn: +1000 power for every [Kung Fu Jugon]; nothing on the opponent's turn", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-005", "OP18-005"] }, {});
    for (const c of south(e).characters.filter((x) => x?.cardId === "OP18-005")) {
      expect(c?.power).toBe(2000);
    }
    e.endTurn("south");
    expect(powerOf(e, "south", "OP18-005")).toBe(0);
  });
});

describe("OP18-006 Koza", () => {
  test("with [Nefeltari Vivi] it gains [Rush] and +1000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-006"], character: ["OP18-011"], activeDon: 3 },
      {},
    );
    e.playCard("OP18-006", "south");
    expect(powerOf(e, "south", "OP18-006")).toBe(5000);
    const life = north(e).lifeCount;
    e.attack("OP18-006", e.leader("north"), "south");
    expect(north(e).lifeCount).toBe(life - 1);
  });

  test("without [Nefeltari Vivi] it stays at 4000", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-006"] }, {});
    expect(powerOf(e, "south", "OP18-006")).toBe(4000);
  });
});

describe("OP18-007 Smoker", () => {
  test("with a {Navy} Leader it gains [Banish] and +1000", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "OP05-022", character: ["OP18-007"] }, {});
    expect(powerOf(e, "south", "OP18-007")).toBe(6000);
  });

  test("without a {Navy} Leader it stays at 5000", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-007"] }, {});
    expect(powerOf(e, "south", "OP18-007")).toBe(5000);
  });
});

describe("OP18-008 Chaka", () => {
  test("On Play: trash a ≤5000-power Character to draw 2 and gain [Banish]", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-001", hand: ["OP18-008", "OP18-002"], deck: 4, activeDon: 5 },
      {},
    );
    e.playCard("OP18-008", "south");
    e.accept("south");
    const chaka = e.findCardInZone("south", "character", "OP18-008");
    expect(ids(south(e).trash)).toEqual(["OP18-002"]);
    expect(south(e).hand).toHaveLength(2);
    expect(hasGranted(e, chaka, "banish")).toBe(true);
    // [Rush] with an Alabasta Leader: it attacks this turn.
    const life = north(e).lifeCount;
    e.attack("OP18-008", e.leader("north"), "south");
    expect(north(e).lifeCount).toBe(life - 1);
  });

  test("declining keeps the hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-008", "OP18-002"], deck: 4, activeDon: 5 },
      {},
    );
    e.playCard("OP18-008", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["OP18-002"]);
    expect(south(e).deckCount).toBe(4);
  });
});

describe("OP18-009 Super Spot-Billed Duck Troops", () => {
  test("Activate: Main trash this: with 9+ DON!! play a [Karoo] from hand", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-009"], hand: ["OP18-004", "OP18-003"], activeDon: 9 },
      {},
    );
    e.activateMain("OP18-009", "south");
    e.accept("south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP18-004"]);
    e.choose("effectPlaySelection", ["OP18-004"], "south");
    expect(ids(south(e).characters)).toContain("OP18-004");
    expect(ids(south(e).trash)).toEqual(["OP18-009"]);
  });

  test("with fewer than 9 DON!! nothing is played; declining keeps it", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-009"], hand: ["OP18-004"], activeDon: 8 },
      {},
    );
    e.activateMain("OP18-009", "south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP18-009");
    e.activateMain("OP18-009", "south");
    e.accept("south");
    expect(ids(south(e).hand)).toEqual(["OP18-004"]);
    expect(ids(south(e).trash)).toEqual(["OP18-009"]);
  });
});

describe("OP18-010 Tony Tony.Chopper", () => {
  test("On K.O. adds a ≤4000-power Character from trash to hand", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-010" }, rested: true }], trash: ["OP18-002", "OP18-003"] },
      attacker8000,
      { activeSeat: "north" },
    );
    northKos(e, "OP18-010");
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP18-002"]);
    e.choose("effectTargetSelection", ["OP18-002"], "south");
    expect(ids(south(e).hand)).toEqual(["OP18-002"]);
  });
});

describe("OP18-011 Nefeltari Vivi", () => {
  test("Animal+Alabasta Characters gain +1000; on the opponent's turn Vivi has [Blocker] and +6000", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-011", "OP18-003"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
    );
    expect(powerOf(e, "south", "OP18-003")).toBe(7000);
    expect(powerOf(e, "south", "OP18-011")).toBe(0);
    e.endTurn("south");
    expect(powerOf(e, "south", "OP18-011")).toBe(6000);
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    expect(candidates(e, "battleBlocker").filter(Boolean)).toContain("OP18-011");
  });
});

describe("OP18-012 Pincers", () => {
  test("When Attacking: an Animal+Alabasta Character gains +1000 this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-012" }, playedOnTurn: 0 }, "OP18-003"] },
      {},
    );
    e.attack("OP18-012", e.leader("north"), "south");
    e.choose("effectTargetSelection", ["OP18-003"], "south");
    expect(powerOf(e, "south", "OP18-003")).toBe(7000);
  });
});

describe("OP18-013 Pell", () => {
  test("On Play: trash a ≤5000-power Character: draw 2 and trash an opposing ≤3000 base power Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-013", "OP18-002"], deck: 4, activeDon: 5 },
      { character: ["EB01-005", "EB01-018"] },
    );
    e.playCard("OP18-013", "south");
    e.accept("south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-005"]);
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    expect(ids(north(e).trash)).toEqual(["EB01-005"]);
    expect(south(e).hand).toHaveLength(2);
  });

  test("declining changes nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-013", "OP18-002"], deck: 4, activeDon: 5 },
      { character: ["EB01-005"] },
    );
    e.playCard("OP18-013", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["OP18-002"]);
    expect(north(e).trash).toEqual([]);
  });
});

describe("OP18-014 Portgas.D.Ace", () => {
  test("When Attacking: an Alabasta Character gains [Rush] this turn", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP18-014" }, playedOnTurn: 0 }],
        hand: ["OP18-003"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("OP18-003", "south");
    e.attack("OP18-014", e.leader("north"), "south");
    e.choose("effectTargetSelection", ["OP18-003"], "south");
    const seaCat = e.findCardInZone("south", "character", "OP18-003");
    expect(hasGranted(e, seaCat, "rush")).toBe(true);
  });
});

describe("OP18-015 Eyelashes", () => {
  test("On Your Opponent's Attack: trash this with an Alabasta Leader: -3000 to the attacker", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-001", character: ["OP18-015"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.accept("south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(ids(south(e).trash)).toEqual(["OP18-015"]);
    expect(south(e).lifeCount).toBe(life);
  });

  test("declining keeps Eyelashes and the Leader takes the hit", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-001", character: ["OP18-015"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP18-015");
    expect(south(e).lifeCount).toBe(life - 1);
  });
});

describe("OP18-016 Monkey.D.Luffy", () => {
  test("On K.O. plays an Alabasta Character with 6000 power or less from hand", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-016" }, rested: true }], hand: ["OP18-003", "EB01-018"] },
      attacker8000,
      { activeSeat: "north" },
    );
    northKos(e, "OP18-016");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP18-003"]);
    e.choose("effectPlaySelection", ["OP18-003"], "south");
    expect(ids(south(e).characters)).toContain("OP18-003");
  });
});

describe("OP18-017 Roronoa Zoro", () => {
  test("an Alabasta Character removed by an opponent's effect: Leader -2000 instead; declining lets it go", () => {
    const make = () =>
      OnePieceTestEngine.create(
        { character: ["OP18-017", "OP18-012"] },
        { hand: ["OP13-013"], activeDon: 3 },
        { activeSeat: "north" },
      );
    const e = make();
    e.playCard("OP13-013", "north");
    e.choose(
      "effectTargetSelection",
      [e.findCardInZone("south", "character", "OP18-012")],
      "north",
    );
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(ids(south(e).characters)).toContain("OP18-012");
    expect(south(e).leader?.power).toBe(3000);

    const d = make();
    d.playCard("OP13-013", "north");
    d.choose(
      "effectTargetSelection",
      [d.findCardInZone("south", "character", "OP18-012")],
      "north",
    );
    d.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
    expect(ids(south(d).trash)).toEqual(["OP18-012"]);
    expect(south(d).leader?.power).toBe(5000);
  });

  test("When Attacking: an Alabasta Character gains [Rush] this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-017" }, playedOnTurn: 0 }, "OP18-012"] },
      {},
    );
    e.attack("OP18-017", e.leader("north"), "south");
    e.choose("effectTargetSelection", ["OP18-012"], "south");
    expect(hasGranted(e, e.findCardInZone("south", "character", "OP18-012"), "rush")).toBe(true);
  });
});

describe("OP18-018 Let's Go, Karoo!!", () => {
  test("Main: Alabasta Characters gain +1000 this turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-018"], character: ["OP18-003", "EB01-005"], activeDon: 1 },
      {},
    );
    e.playCard("OP18-018", "south");
    expect(powerOf(e, "south", "OP18-003")).toBe(7000);
    expect(powerOf(e, "south", "EB01-005")).toBe(3000);
  });

  test("Trigger: +2000 to a Leader or Character this turn", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-018", "EB01-005"] },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).leader?.power).toBe(7000);
  });
});

describe("OP18-019 Quack!!!", () => {
  test("Main with no 7000+ base power Character: an opposing Character -3000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-019"], character: ["EB01-005"], activeDon: 1 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP18-019", "south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(powerOf(e, "north", "EB01-018")).toBe(4000);
  });

  test("Main does nothing with a 7000+ base power Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-019"], character: ["EB01-018"], activeDon: 1 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP18-019", "south");
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter: the Leader gains +3000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-019"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "OP18-019");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("OP18-020 Stop Fighting!!!", () => {
  const make = () =>
    OnePieceTestEngine.create(
      { leaderCardId: "EB03-001", hand: ["OP18-020"], life: 3, activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
  test("Counter: all Life to hand with a [Nefeltari Vivi] Leader: opposing Leader and Characters -5000", () => {
    const e = make();
    const eventId = e.findCardInZone("south", "hand", "OP18-020");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.accept("south");
    expect(south(e).lifeCount).toBe(0);
    expect(south(e).hand).toHaveLength(3);
    expect(north(e).leader?.power).toBe(0);
    expect(powerOf(e, "north", "EB01-018")).toBe(2000);
  });

  test("declining keeps the Life", () => {
    const e = make();
    const eventId = e.findCardInZone("south", "hand", "OP18-020");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.decline("south");
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
    expect(south(e).lifeCount).toBe(2);
  });
});

const restedLeader = (e: Engine) => e.getState().cards[e.leader("south")]!.rested;

describe("OP18-021 Franky (Leader)", () => {
  test("Activate: Main DON!! -1: play a cost 5 or less Stage from hand, once per turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-021", hand: ["EB01-011", "EB01-011"], activeDon: 3 },
      {},
    );
    e.activateMain(e.leader("south"), "south");
    e.accept("south");
    payReturnDon(e);
    e.choose("effectPlaySelection", [e.getState().players.south.hand[0]!], "south");
    expect(e.getState().players.south.stageArea).not.toBeNull();
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.leader("south"),
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("declining keeps the DON!! and the hand", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-021", hand: ["EB01-011"], activeDon: 3 },
      {},
    );
    const donDeck = south(e).donDeckCount;
    e.activateMain(e.leader("south"), "south");
    e.decline("south");
    expect(south(e).donDeckCount).toBe(donDeck);
    expect(ids(south(e).hand)).toEqual(["EB01-011"]);
  });
});

/** Pay a DON!! -N cost with the first offered DON!! if the engine asks. */
function payReturnDon(e: Engine, n = 1): void {
  if (!pending(e, "south", "effectCostReturnDon")) return;
  const step = e.pendingDecision("effectCostReturnDon", "south").steps[0];
  if (step?.kind !== "payCost") throw new Error("Expected a DON!! return.");
  e.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: step.candidates.slice(0, n).map((c) => c.ref.id) },
    "south",
  );
}

describe("OP18-022 Monkey.D.Luffy (Leader)", () => {
  test("DON!! x3 When Attacking: set this Leader active; it then stays rested-free next Refresh", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "OP18-022", activeDon: 3 }, {});
    e.attachDon(e.leader("south"), 3, "south");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.accept("south");
    expect(restedLeader(e)).toBe(false);
    const flags = Object.values(e.getState().modifiers).map((m) => JSON.stringify(m));
    expect(flags.some((m) => m.includes(e.leader("south")) && /freeze/i.test(m))).toBe(true);
  });

  test("declining leaves the Leader rested; without 3 DON!! nothing is offered", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "OP18-022", activeDon: 3 }, {});
    e.attachDon(e.leader("south"), 3, "south");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.decline("south");
    expect(restedLeader(e)).toBe(true);
    const f = OnePieceTestEngine.create({ leaderCardId: "OP18-022", activeDon: 2 }, {});
    f.attachDon(f.leader("south"), 2, "south");
    f.declareAttack(f.leader("south"), f.leader("north"), "south");
    expect(pending(f, "south", "effectOptional")).toBe(false);
  });
});

describe("OP18-023 Gaimon", () => {
  test("On Play: an East Blue Leader or Character gains [Banish] this turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-023"], character: ["EB05-057"], activeDon: 1 },
      {},
    );
    e.playCard("OP18-023", "south");
    const target = e.findCardInZone("south", "character", "EB05-057");
    expect(candidates(e, "effectTargetSelection")).toContain("EB05-057");
    e.choose("effectTargetSelection", [target], "south");
    expect(hasGranted(e, target, "banish")).toBe(true);
  });
});

describe("OP18-024 Kokoro", () => {
  test("[Blocker]; End of Your Turn: trash this to set the Leader active", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-024"], activeDon: 0 }, {});
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    expect(restedLeader(e)).toBe(true);
    e.endTurn("south");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["OP18-024"]);
    expect(restedLeader(e)).toBe(false);
  });

  test("declining keeps Kokoro and the Leader rested", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-024"] }, {});
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.endTurn("south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP18-024");
    expect(restedLeader(e)).toBe(true);
  });
});

describe("OP18-025 Gonbe", () => {
  test("End of Your Turn: if this Character is rested, set the Leader active", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-025" }, rested: true }] },
      {},
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.endTurn("south");
    expect(restedLeader(e)).toBe(false);
  });

  test("an active Gonbe does nothing", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-025"] }, {});
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.endTurn("south");
    expect(restedLeader(e)).toBe(true);
  });
});

describe("OP18-026 Sanji", () => {
  test("a Straw Hat Crew Character removed by an opponent's effect: trash Sanji instead (or decline)", () => {
    const make = () =>
      OnePieceTestEngine.create(
        { character: ["OP18-026", "OP18-036"] },
        { hand: ["OP13-013"], activeDon: 3 },
        { activeSeat: "north" },
      );
    const e = make();
    e.playCard("OP13-013", "north");
    e.choose(
      "effectTargetSelection",
      [e.findCardInZone("south", "character", "OP18-036")],
      "north",
    );
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(ids(south(e).characters)).toContain("OP18-036");
    expect(ids(south(e).trash)).toEqual(["OP18-026"]);

    const d = make();
    d.playCard("OP13-013", "north");
    d.choose(
      "effectTargetSelection",
      [d.findCardInZone("south", "character", "OP18-036")],
      "north",
    );
    d.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
    expect(ids(south(d).trash)).toEqual(["OP18-036"]);
  });
});

describe("OP18-027 Zoro & Sogeking", () => {
  test("Opponent's Turn: the active Luffy Leader with 3+ DON!! has base power 7000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-022", character: ["OP18-027"], activeDon: 3 },
      {},
    );
    e.attachDon(e.leader("south"), 3, "south");
    e.endTurn("south");
    expect(south(e).leader?.power).toBe(7000);
  });

  test("On Play: set 2 DON!! active; an opposing cost 6 or less Character cannot be rested", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-027"], activeDon: 5 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP18-027", "south");
    e.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(south(e).activeDon).toBe(2);
    const god = e.findCardInZone("north", "character", "EB01-018");
    expect(Object.values(e.getState().modifiers).some((m) => JSON.stringify(m).includes(god))).toBe(
      true,
    );
  });
});

describe("OP18-028 Chimney", () => {
  test("Activate: Main rest a [Gonbe] and this: set the Luffy Leader active", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-022", character: ["OP18-028", "OP18-025"] },
      {},
    );
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    if (pending(e, "south", "effectOptional")) e.decline("south");
    expect(restedLeader(e)).toBe(true);
    e.activateMain("OP18-028", "south");
    e.accept("south");
    expect(restedLeader(e)).toBe(false);
    expect(south(e).characters.filter((c) => c?.rested)).toHaveLength(2);
  });

  test("declining keeps both active", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-022", character: ["OP18-028", "OP18-025"] },
      {},
    );
    e.activateMain("OP18-028", "south");
    e.decline("south");
    expect(south(e).characters.filter((c) => c?.rested)).toHaveLength(0);
  });
});

describe("OP18-029 Tony Tony.Chopper", () => {
  test("When Attacking once per turn: give up to 3 rested DON!! to the Leader and set this active", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-029" }, playedOnTurn: 0 }], restedDon: 3 },
      {},
    );
    e.attack("OP18-029", e.leader("north"), "south");
    e.chooseAmount(3, "south");
    expect(e.getState().cards[e.leader("south")]?.attachedDon).toBe(3);
    expect(south(e).characters.find((c) => c?.cardId === "OP18-029")?.rested).toBe(false);
  });
});

describe("OP18-030 Nami", () => {
  test("Opponent's Turn: rested, this Character has -2000 power", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-030" }, rested: true }, "OP18-030"] },
      {},
    );
    e.endTurn("south");
    const powers = south(e)
      .characters.filter((c) => c?.cardId === "OP18-030")
      .map((c) => c?.power);
    expect(powers.sort((a, b) => Number(a) - Number(b))).toEqual([4000, 6000]);
  });
});

describe("OP18-031 Nico Robin", () => {
  test("Opponent's Turn: a Character removed by an opponent's effect: rest Robin instead", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-031", "OP18-012"] },
      { hand: ["OP13-013"], activeDon: 3 },
      { activeSeat: "north" },
    );
    e.playCard("OP13-013", "north");
    e.choose(
      "effectTargetSelection",
      [e.findCardInZone("south", "character", "OP18-012")],
      "north",
    );
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(ids(south(e).characters)).toContain("OP18-012");
    expect(south(e).characters.find((c) => c?.cardId === "OP18-031")?.rested).toBe(true);
  });

  test("End of Your Turn: set a Water Seven card and a DON!! active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-031", { card: { id: "OP18-035" }, rested: true }], restedDon: 1 },
      {},
    );
    e.endTurn("south");
    if (pending(e, "south", "effectTargetSelection")) {
      e.choose("effectTargetSelection", ["OP18-035"], "south");
    }
    if (pending(e, "south", "effectSetActiveDon")) {
      e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    }
    expect(south(e).characters.find((c) => c?.cardId === "OP18-035")?.rested).toBe(false);
  });
});

describe("OP18-032 Buggy", () => {
  test("On Play: a rested ≤8000-power Character stays rested in the next Refresh Phase", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-032"], activeDon: 5 },
      { character: [{ card: { id: "EB01-018" }, rested: true }] },
    );
    e.playCard("OP18-032", "south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    e.endTurn("south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
  });

  test("On K.O. does the same", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-032" }, rested: true }] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    northKos(e, "OP18-032");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-041"]);
  });
});

describe("OP18-033 Banban", () => {
  test("[Blocker]; End of Your Turn: trash this to set a Character active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-033", { card: { id: "OP18-035" }, rested: true }] },
      {},
    );
    e.endTurn("south");
    e.accept("south");
    e.choose("effectTargetSelection", ["OP18-035"], "south");
    expect(south(e).characters.find((c) => c?.cardId === "OP18-035")?.rested).toBe(false);
    expect(ids(south(e).trash)).toEqual(["OP18-033"]);
  });

  test("declining keeps Banban", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-033", { card: { id: "OP18-035" }, rested: true }] },
      {},
    );
    e.endTurn("south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP18-033");
  });
});

describe("OP18-034 Franky", () => {
  test("On Play: play a Franky Family/Straw Hat Crew card ≤5; with a cost 5+ Stage, rest a ≤6 Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-034", "OP18-036"], stage: "OP05-040", activeDon: 6 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP18-034", "south");
    e.choose("effectPlaySelection", ["OP18-036"], "south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(ids(south(e).characters)).toContain("OP18-036");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
  });

  test("without a cost 5+ Stage nothing is rested", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-034"], activeDon: 6 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP18-034", "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(false);
  });
});

describe("OP18-035 Michael & Hoichael (no text on the official card list: vanilla)", () => {
  test("plays as a 3-cost 5000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-035"], activeDon: 3 }, {});
    e.playCard("OP18-035", "south");
    expect(powerOf(e, "south", "OP18-035")).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("OP18-036 Monkey.D.Luffy", () => {
  test("End of Your Turn: trash this: draw 1 and set the Leader active", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-036"], deck: 3 }, {});
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.endTurn("south");
    e.accept("south");
    expect(restedLeader(e)).toBe(false);
    expect(ids(south(e).trash)).toEqual(["OP18-036"]);
    expect(south(e).deckCount).toBe(2);
  });

  test("declining keeps Luffy and the deck", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-036"], deck: 3 }, {});
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.endTurn("south");
    e.decline("south");
    expect(south(e).deckCount).toBe(3);
    expect(restedLeader(e)).toBe(true);
  });
});

describe("OP18-037 Yokozuna", () => {
  test("[Blocker]; On K.O. rests an opposing card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-037" }, rested: true }] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }, "EB01-018"] },
      { activeSeat: "north" },
    );
    northKos(e, "OP18-037");
    const target = e.findCardInZone("north", "character", "EB01-018");
    const intent = e
      .getState()
      .promptQueue.find((p) => p.status === "pending" && p.seat === "south")
      ?.resolutionContext?.intent;
    e.resolveDecision(intent as never, { selectedIds: [target] }, "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
  });
});

describe("OP18-038 Shoot Down That Flag.", () => {
  test("Main: top 5, a [Sogeking] or Straw Hat Crew card to hand", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["OP18-038"],
        deck: ["OP18-036", "EB01-005", "OP01-012", "EB01-018", "EB01-005", "EB01-005"],
        activeDon: 1,
      },
      {},
    );
    e.playCard("OP18-038", "south");
    expect(() => e.choose("effectSearchSelection", ["OP01-012"], "south")).toThrow();
    e.choose("effectSearchSelection", ["OP18-036"], "south");
    if (pending(e, "south", "effectSearchRemainderOrder")) {
      const step = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (step?.kind === "orderItems") {
        e.resolveDecision(
          "effectSearchRemainderOrder",
          { selectedIds: step.candidates.map((c) => c.ref.id) },
          "south",
        );
      }
    }
    expect(ids(south(e).hand)).toEqual(["OP18-036"]);
  });

  test("Trigger draws 1", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-038", "EB01-005"], deck: 3 },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(south(e).deckCount).toBe(2);
  });
});

describe("OP18-039 Gum-Gum Giant Axe", () => {
  test("Counter: a [Monkey.D.Luffy] +2000; with the Leader active, draw 1", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-022", hand: ["OP18-039"], deck: 3, activeDon: 1 },
      { character: [{ card: { id: "EB02-034" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB02-034"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP18-039")] },
      "south",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).deckCount).toBe(2);
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("OP18-040 Diable Jambe Flambé Shot", () => {
  test("Main: K.O. an opposing rested cost 7 or less Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-040"], activeDon: 4 },
      { character: [{ card: { id: "EB01-018" }, rested: true }, "EB01-005"] },
    );
    e.playCard("OP18-040", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(ids(north(e).trash)).toEqual(["EB01-018"]);
  });

  test("Trigger: rest an opposing cost 7 or less Character", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP18-040", "EB01-005"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
  });
});

describe("OP18-118 Monkey.D.Luffy", () => {
  test("On Play: set 3 DON!! active; an opposing Character cannot be rested", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-118"], activeDon: 9 },
      { character: ["EB01-018"] },
    );
    e.playCard("OP18-118", "south");
    e.resolveDecision("effectSetActiveDon", { optionId: "3" }, "south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(south(e).activeDon).toBe(3);
  });

  test("End of Your Turn: set a Water Seven card active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-118", { card: { id: "OP18-035" }, rested: true }] },
      {},
    );
    e.endTurn("south");
    e.choose("effectTargetSelection", ["OP18-035"], "south");
    expect(south(e).characters.find((c) => c?.cardId === "OP18-035")?.rested).toBe(false);
  });
});
