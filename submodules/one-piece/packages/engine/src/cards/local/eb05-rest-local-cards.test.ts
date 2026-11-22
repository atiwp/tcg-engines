// OP Practice local cards (fork-only): command-driven proofs for the remaining EB05 definitions in
// packages/cards/src/cards/local/. Unsupported clauses are listed in local/LOCAL-CARDS.md.
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
/** Accept the offered bottom-of-deck order for a search's remainder. */
const keepRemainderOrder = (e: Engine, seat: Seat = "south") => {
  const step = e.pendingDecision("effectSearchRemainderOrder", seat).steps[0];
  if (step?.kind !== "orderItems") throw new Error("Expected a remainder order.");
  e.resolveDecision(
    "effectSearchRemainderOrder",
    { selectedIds: step.candidates.map((c) => c.ref.id) },
    seat,
  );
};
/** Pay a DON!! -N cost by returning the first offered DON!! cards, if the engine asks. */
const payReturnDon = (e: Engine, n: number, seat: Seat = "south") => {
  const pending = e
    .getState()
    .promptQueue.some(
      (p) =>
        p.status === "pending" &&
        p.seat === seat &&
        p.resolutionContext?.intent === "effectCostReturnDon",
    );
  if (!pending) return;
  const step = e.pendingDecision("effectCostReturnDon", seat).steps[0];
  if (step?.kind !== "payCost") throw new Error("Expected a DON!! return.");
  e.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: step.candidates.slice(0, n).map((c) => c.ref.id) },
    seat,
  );
};
const south = (e: Engine) => e.getView("south").players.south;
const north = (e: Engine) => e.getView("south").players.north;
const powerOf = (e: Engine, seat: Seat, cardId: string) =>
  e.getView("south").players[seat].characters.find((c) => c?.cardId === cardId)?.power;

describe("EB05-002 Doll", () => {
  const deck = ["EB02-034", "EB01-018", "OP02-097", "EB02-042", "EB01-005", "EB01-005"];
  test("On Play adds up to 2 cost 2+ Navy cards from the top 5, then trashes 1 from hand", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-002", "EB01-005"], deck, activeDon: 1 }, {});
    e.playCard("EB05-002", "south");
    const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Doll's search.");
    expect(step.max).toBe(2);
    e.choose("effectSearchSelection", ["EB02-034", "EB02-042"], "south");
    keepRemainderOrder(e);
    const discard = e.findCardInZone("south", "hand", "EB01-005");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discard] }, "south");
    const view = south(e);
    expect(ids(view.hand).sort(byText)).toEqual(["EB02-034", "EB02-042"]);
    expect(ids(view.trash)).toEqual(["EB01-005"]);
    expect(view.deckCount).toBe(4);
  });

  test("a cost 1 Navy card cannot be taken", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-002"], deck, activeDon: 1 }, {});
    e.playCard("EB05-002", "south");
    expect(() => e.choose("effectSearchSelection", ["OP02-097"], "south")).toThrow();
  });
});

describe("EB05-003 Pasia (no text from source: vanilla)", () => {
  test("plays as a 1-cost 3000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-003"], activeDon: 1 }, {});
    e.playCard("EB05-003", "south");
    expect(powerOf(e, "south", "EB05-003")).toBe(3000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-004 Baby 5", () => {
  test("On Play: reveal 2 Events from hand to draw 2", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-004", "EB05-008", "EB05-009"], deck: 5, activeDon: 4 },
      {},
    );
    e.playCard("EB05-004", "south");
    e.accept("south");
    expect(south(e).hand).toHaveLength(4);
    expect(south(e).deckCount).toBe(3);
  });

  test("declining the reveal draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-004", "EB05-008", "EB05-009"], deck: 5, activeDon: 4 },
      {},
    );
    e.playCard("EB05-004", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["EB05-008", "EB05-009"]);
    expect(south(e).deckCount).toBe(5);
  });

  test("On K.O. plays a 6000-power-or-less Character from hand rested", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "EB05-004" }, rested: true }], hand: ["EB01-005", "EB01-055"] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "EB05-004"),
      "north",
    );
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["EB01-005"]);
    e.choose("effectPlaySelection", ["EB01-005"], "south");
    const doma = south(e).characters.find((c) => c?.cardId === "EB01-005");
    expect(doma?.rested).toBe(true);
  });
});

describe("EB05-005 Belo Betty", () => {
  test("On Play gives Revolutionary Army Characters with a [Trigger] +2000 this turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-005"], character: ["OP09-108", "EB01-005"], activeDon: 2 },
      {},
    );
    e.playCard("EB05-005", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP09-108"]);
    e.choose("effectTargetSelection", ["OP09-108"], "south");
    expect(powerOf(e, "south", "OP09-108")).toBe(7000);
  });

  test("Activate: Main trash this Character: an opposing Character gets -2000", () => {
    const e = OnePieceTestEngine.create({ character: ["EB05-005"] }, { character: ["EB01-018"] });
    e.activateMain("EB05-005", "south");
    e.accept("south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(ids(south(e).trash)).toEqual(["EB05-005"]);
    expect(powerOf(e, "north", "EB01-018")).toBe(5000);
  });

  test("declining keeps Belo Betty on the field", () => {
    const e = OnePieceTestEngine.create({ character: ["EB05-005"] }, { character: ["EB01-018"] });
    e.activateMain("EB05-005", "south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("EB05-005");
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
  });
});

describe("EB05-006 Miss Buckingham Stussy", () => {
  test.each([
    ["0", "EB01-005", "south", 6000],
    ["1", "EB01-018", "north", 3000],
  ] as const)(
    "Life to hand, option %s: %s gets the power change",
    (optionId, target, seat, expected) => {
      const e = OnePieceTestEngine.create(
        { character: ["EB05-006", "EB01-005"] },
        { character: ["EB01-018"] },
      );
      const life = south(e).lifeCount;
      e.activateMain("EB05-006", "south");
      e.accept("south");
      e.resolveDecision("effectActionChoice", { optionId }, "south");
      expect(candidates(e, "effectTargetSelection").sort(byText)).toEqual([
        "EB01-005",
        "EB01-018",
        "EB05-006",
      ]);
      e.choose("effectTargetSelection", [target], "south");
      expect(south(e).lifeCount).toBe(life - 1);
      expect(powerOf(e, seat, target)).toBe(expected);
    },
  );

  test("declining keeps the Life", () => {
    const e = OnePieceTestEngine.create({ character: ["EB05-006"] }, {});
    const life = south(e).lifeCount;
    e.activateMain("EB05-006", "south");
    e.decline("south");
    expect(south(e).lifeCount).toBe(life);
    expect(south(e).hand).toEqual([]);
  });
});

describe("EB05-007 Monet", () => {
  test("On Play: reveal 3 Event or Punk Hazard cards to draw 1", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-007", "EB05-008", "EB05-009", "EB01-050"], deck: 5, activeDon: 2 },
      {},
    );
    e.playCard("EB05-007", "south");
    e.accept("south");
    expect(south(e).hand).toHaveLength(4);
    expect(south(e).deckCount).toBe(4);
  });

  test("declining the reveal draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-007", "EB05-008", "EB05-009", "EB01-050"], deck: 5, activeDon: 2 },
      {},
    );
    e.playCard("EB05-007", "south");
    e.decline("south");
    expect(south(e).hand).toHaveLength(3);
    expect(south(e).deckCount).toBe(5);
  });

  test("End of Your Turn: +5000 power until the end of the opponent's next End Phase", () => {
    const e = OnePieceTestEngine.create({ character: ["EB05-007"] }, {});
    e.endTurn("south");
    expect(powerOf(e, "south", "EB05-007")).toBe(6000);
    e.endTurn("north");
    expect(powerOf(e, "south", "EB05-007")).toBe(1000);
  });
});

describe("EB05-008 Luffy, Now's Your Chance", () => {
  test("Main: give 1 active DON!! to the Leader and reveal 2 red Events: a rested Character gets -7000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-008", "EB05-009", "EB05-009"], activeDon: 2 },
      { character: [{ card: { id: "EB01-018" }, rested: true }, "EB01-055"] },
    );
    e.playCard("EB05-008", "south");
    e.accept("south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(powerOf(e, "north", "EB01-018")).toBe(0);
    expect(e.getState().cards[e.leader("south")]?.attachedDon).toBe(1);
  });

  test("declining keeps the DON!! in the cost area", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-008", "EB05-009", "EB05-009"], activeDon: 2 },
      { character: [{ card: { id: "EB01-018" }, rested: true }] },
    );
    e.playCard("EB05-008", "south");
    e.decline("south");
    expect(south(e).activeDon).toBe(1);
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
  });

  test("Counter with no cost 5+ Character gives +4000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-008"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-008");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("EB05-009 Fight and Die with Me!!!", () => {
  test("Main: Characters with 4000 base power or less gain +1000 until the opponent's next End Phase", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-009"], character: ["EB01-005", "EB01-018"], activeDon: 1 },
      {},
    );
    e.playCard("EB05-009", "south");
    expect(powerOf(e, "south", "EB01-005")).toBe(4000);
    expect(powerOf(e, "south", "EB01-018")).toBe(7000);
    e.endTurn("south");
    expect(powerOf(e, "south", "EB01-005")).toBe(4000);
    e.endTurn("north");
    expect(powerOf(e, "south", "EB01-005")).toBe(3000);
  });

  test("Counter gives the Leader +3000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-009"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-009");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("EB05-011 Otohime", () => {
  const face = { cardId: "EB01-005", faceUp: true };
  test("On Play with a Shirahoshi Leader: turn a Life face-down to rest a cost 5 or less Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", hand: ["EB05-011"], life: [face, "EB01-005"], activeDon: 1 },
      { character: ["EB01-018", "EB01-055"] },
    );
    e.playCard("EB05-011", "south");
    e.accept("south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
    expect(e.getState().cards[e.getState().players.south.life[0]!]?.faceUp).toBe(false);
  });

  test("declining keeps the Life face-up and rests nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", hand: ["EB05-011"], life: [face, "EB01-005"], activeDon: 1 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-011", "south");
    e.decline("south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(false);
    expect(e.getState().cards[e.getState().players.south.life[0]!]?.faceUp).toBe(true);
  });

  test("On Play does nothing without a Shirahoshi Leader", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-011"], life: [face, "EB01-005"], activeDon: 1 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-011", "south");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(false);
  });
});

describe("EB05-013 Shirley", () => {
  test("On Your Opponent's Attack: rest 1 DON!!: a Merfolk Leader gains +2000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", character: ["EB05-013"], activeDon: 1 },
      { character: [{ card: { id: "EB02-034" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB02-034"), e.leader("south"), "north");
    e.accept("south");
    expect(south(e).restedDon).toBe(1);
    expect(south(e).lifeCount).toBe(life);
  });

  test("declining keeps the DON!! active and the Leader takes the hit", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", character: ["EB05-013"], activeDon: 1 },
      { character: [{ card: { id: "EB02-034" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB02-034"), e.leader("south"), "north");
    e.decline("south");
    expect(south(e).activeDon).toBe(1);
    expect(south(e).lifeCount).toBe(life - 1);
  });
});

/** North's Character attacks South's Leader (South uses no counter if it has a hand). */
function northAttacksSouthLeader(e: Engine, attacker: string): void {
  e.declareAttack(e.findCardInZone("north", "character", attacker), e.leader("south"), "north");
}

/** North's 8000-power Character attacks South's rested Character. */
function northAttacksSouthCharacter(e: Engine, target: string): void {
  e.declareAttack(
    e.findCardInZone("north", "character", "EB01-041"),
    e.findCardInZone("south", "character", target),
    "north",
  );
}

describe("EB05-014 Shirahoshi", () => {
  test("On Play adds up to 2 [Megalo] or {Neptunian} cards from the top 5 and trashes the rest", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["EB05-014"],
        deck: ["EB04-018", "OP11-026", "EB01-005", "OP01-012", "EB01-018", "EB01-005"],
        activeDon: 1,
      },
      {},
    );
    e.playCard("EB05-014", "south");
    e.choose("effectSearchSelection", ["EB04-018", "OP11-026"], "south");
    const view = south(e);
    expect(ids(view.hand).sort(byText)).toEqual(["EB04-018", "OP11-026"]);
    expect(view.trash).toHaveLength(3);
    expect(view.deckCount).toBe(1);
  });

  test("Activate: Main rest this: a 6000-power-or-less {Neptunian} gains [Rush]", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-014", { card: { id: "OP11-027" } }, "OP11-026"] },
      {},
    );
    e.activateMain("EB05-014", "south");
    e.accept("south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP11-027"]);
    e.choose("effectTargetSelection", ["OP11-027"], "south");
    expect(south(e).characters.find((c) => c?.cardId === "EB05-014")?.rested).toBe(true);
    const target = e.findCardInZone("south", "character", "OP11-027");
    const rush = Object.values(e.getState().modifiers).filter(
      (m) => JSON.stringify(m).includes(target) && JSON.stringify(m).includes('"rush"'),
    );
    expect(rush).toHaveLength(1);
  });

  test("declining keeps Shirahoshi active", () => {
    const e = OnePieceTestEngine.create({ character: ["EB05-014", "OP11-027"] }, {});
    e.activateMain("EB05-014", "south");
    e.decline("south");
    expect(south(e).characters.find((c) => c?.cardId === "EB05-014")?.rested).toBe(false);
  });
});

describe("EB05-015 Tashigi (no text from source: vanilla)", () => {
  test("plays as a 5-cost 7000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-015"], activeDon: 5 }, {});
    e.playCard("EB05-015", "south");
    expect(powerOf(e, "south", "EB05-015")).toBe(7000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-017 Mermaid Cafe Dancers", () => {
  test("On Your Opponent's Attack: rest 1 DON!! and trash this: a Merfolk Leader gains +4000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", character: ["EB05-017"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    northAttacksSouthLeader(e, "EB01-018");
    e.accept("south");
    expect(ids(south(e).trash)).toEqual(["EB05-017"]);
    expect(south(e).restedDon).toBe(1);
    expect(south(e).lifeCount).toBe(life);
  });

  test("declining keeps it on the field and the Leader takes the hit", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", character: ["EB05-017"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("EB05-017");
    expect(south(e).activeDon).toBe(1);
    expect(south(e).lifeCount).toBe(life - 1);
  });
});

describe("EB05-018 Rebecca", () => {
  test("On Play: a rested cost 6 or less Character does not become active in the next Refresh Phase", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-018"], activeDon: 1 },
      {
        character: [
          { card: { id: "EB01-018" }, rested: true },
          { card: { id: "EB01-055" }, rested: true },
        ],
      },
    );
    e.playCard("EB05-018", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    e.endTurn("south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
    expect(north(e).characters.find((c) => c?.cardId === "EB01-055")?.rested).toBe(false);
  });
});

describe("EB05-019 I Choose to Open This Country to the World!!", () => {
  const counterSetup = () =>
    OnePieceTestEngine.create(
      {
        leaderCardId: "OP12-001",
        hand: ["EB05-019"],
        character: [{ card: { id: "OP12-023" }, rested: true }],
        activeDon: 2,
      },
      { character: [{ card: { id: "EB01-055" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );

  test("Counter: rest 1 of your cards: a {Land of Wano} Character gains +4000 this battle", () => {
    const e = counterSetup();
    const eventId = e.findCardInZone("south", "hand", "EB05-019");
    const wano = e.findCardInZone("south", "character", "OP12-023");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-055"), wano, "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.accept("south");
    e.resolveDecision("effectCostRestCards", { selectedIds: [e.leader("south")] }, "south");
    e.choose("effectTargetSelection", [wano], "south");
    expect(e.getState().cards[e.leader("south")]?.rested).toBe(true);
    // 6000 + 4000 beats the 9000-power attacker: the Character survives.
    expect(ids(south(e).characters)).toContain("OP12-023");
  });

  test("declining the Counter cost leaves the Character to be K.O.'d", () => {
    const e = counterSetup();
    const eventId = e.findCardInZone("south", "hand", "EB05-019");
    const wano = e.findCardInZone("south", "character", "OP12-023");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-055"), wano, "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.decline("south");
    expect(e.getState().cards[e.leader("south")]?.rested).toBe(false);
    expect(ids(south(e).trash).sort(byText)).toEqual(["EB05-019", "OP12-023"]);
  });

  test("Trigger with the opponent at 3 or less Life plays a ≤6000-power {Land of Wano} Character", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-019", "EB01-005"], hand: ["OP12-023", "EB01-018"] },
      { life: 3 },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP12-023"]);
    e.choose("effectPlaySelection", ["OP12-023"], "south");
    expect(ids(south(e).characters)).toContain("OP12-023");
  });
});

describe("EB05-020 My name is Shirahoshi!!", () => {
  test("Main: rest your [Shirahoshi] Leader to draw 2", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", hand: ["EB05-020"], deck: 5, activeDon: 1 },
      {},
    );
    e.playCard("EB05-020", "south");
    e.accept("south");
    expect(south(e).hand).toHaveLength(2);
    expect(south(e).deckCount).toBe(3);
    expect(e.getState().cards[e.leader("south")]?.rested).toBe(true);
  });

  test("declining keeps the Leader active and draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP11-022", hand: ["EB05-020"], deck: 5, activeDon: 1 },
      {},
    );
    e.playCard("EB05-020", "south");
    e.decline("south");
    expect(south(e).deckCount).toBe(5);
    expect(e.getState().cards[e.leader("south")]?.rested).toBe(false);
  });
});

describe("EB05-022 Octopako", () => {
  test("On K.O. draws 2", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "EB05-022" }, rested: true }], deck: 5 },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    northAttacksSouthCharacter(e, "EB05-022");
    expect(ids(south(e).trash)).toEqual(["EB05-022"]);
    expect(south(e).hand).toHaveLength(2);
    expect(south(e).deckCount).toBe(3);
  });
});

describe("EB05-023 Osome", () => {
  test("On Play: trash 2 Events from hand to draw 3", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-023", "EB05-009", "EB05-008", "EB01-005"], deck: 5, activeDon: 1 },
      {},
    );
    e.playCard("EB05-023", "south");
    e.accept("south");
    const view = south(e);
    expect(ids(view.trash).sort(byText)).toEqual(["EB05-008", "EB05-009"]);
    expect(view.hand).toHaveLength(4);
    expect(view.deckCount).toBe(2);
  });

  test("declining keeps the Events and draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-023", "EB05-009", "EB05-008"], deck: 5, activeDon: 1 },
      {},
    );
    e.playCard("EB05-023", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["EB05-009", "EB05-008"]);
    expect(south(e).deckCount).toBe(5);
  });
});

describe("EB05-024 Little Sadi", () => {
  test("with an {Impel Down} Leader it gains [Blocker] and +2 cost", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB01-021", character: ["EB05-024"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    expect(south(e).characters.find((c) => c?.cardId === "EB05-024")?.cost).toBe(3);
    northAttacksSouthLeader(e, "EB01-018");
    expect(candidates(e, "battleBlocker").filter(Boolean)).toEqual(["EB05-024"]);
  });

  test("without an {Impel Down} Leader it stays cost 1 with no [Blocker]", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-024"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    expect(south(e).characters.find((c) => c?.cardId === "EB05-024")?.cost).toBe(1);
    northAttacksSouthLeader(e, "EB01-018");
    expect(
      e
        .getState()
        .promptQueue.some(
          (p) => p.status === "pending" && p.resolutionContext?.intent === "battleBlocker",
        ),
    ).toBe(false);
  });
});

describe("EB05-025 Domino", () => {
  const deck = ["EB01-032", "EB01-005", "OP01-012", "EB01-018"];
  test("On Play adds an {Impel Down} card from the top 3", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-025"], deck, activeDon: 2 }, {});
    e.playCard("EB05-025", "south");
    e.choose("effectSearchSelection", ["EB01-032"], "south");
    keepRemainderOrder(e);
    expect(ids(south(e).hand)).toEqual(["EB01-032"]);
    expect(south(e).deckCount).toBe(3);
  });

  test("Trigger activates the On Play effect", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-025", "EB01-005"], deck },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.choose("effectSearchSelection", ["EB01-032"], "south");
    keepRemainderOrder(e);
    expect(ids(south(e).hand)).toEqual(["EB01-032"]);
  });
});

describe("EB05-026 Hina (no text from source: vanilla)", () => {
  test("plays as a 7-cost 8000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-026"], activeDon: 7 }, {});
    e.playCard("EB05-026", "south");
    expect(powerOf(e, "south", "EB05-026")).toBe(8000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-027 Hibari", () => {
  test("On Play draws 3, trashes 2, then bottoms up to 1 cost 2 or less Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-027"], deck: 5, activeDon: 5 },
      { character: ["EB01-005", "EB01-018"] },
    );
    e.playCard("EB05-027", "south");
    const hand = e.getState().players.south.hand;
    expect(hand).toHaveLength(3);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: hand.slice(0, 2) }, "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-005"]);
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    expect(south(e).hand).toHaveLength(1);
    expect(ids(north(e).characters).filter(Boolean)).toEqual(["EB01-018"]);
    expect(north(e).deckCount).toBe(11);
  });
});

describe("EB05-029 Kimono Sleeve Cage", () => {
  test("Main: trash 1: return an opposing cost 6 or less Character to hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-029", "EB01-005"], activeDon: 5 },
      { character: ["EB01-018", "EB01-055"] },
    );
    e.playCard("EB05-029", "south");
    e.accept("south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(ids(north(e).characters).filter(Boolean)).toEqual(["EB01-055"]);
    expect(north(e).handCount).toBe(1);
    expect(ids(south(e).trash).sort(byText)).toEqual(["EB01-005", "EB05-029"]);
  });

  test("declining keeps the hand card and the opposing Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-029", "EB01-005"], activeDon: 5 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-029", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["EB01-005"]);
    expect(ids(north(e).characters).filter(Boolean)).toEqual(["EB01-018"]);
  });
});

describe("EB05-030 Take Care, Everybody.", () => {
  test("Main with a [Nami] Leader returns a cost 5 or less Character to hand", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP03-040", hand: ["EB05-030"], activeDon: 2 },
      { character: ["EB01-018", "EB01-055"] },
    );
    e.playCard("EB05-030", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(north(e).handCount).toBe(1);
  });

  test("Main does nothing without a [Nami] Leader", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-030"], activeDon: 2 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-030", "south");
    expect(north(e).handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter draws 1 and gives +1000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-030"], deck: 3, activeDon: 2 },
      { character: [{ card: { id: "EB01-005" }, playedOnTurn: 0 }], activeDon: 3 },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-030");
    // A 5000-power attacker hits the 5000 Leader only without the +1000.
    e.attachDon(e.findCardInZone("north", "character", "EB01-005"), 2, "north");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-005"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).deckCount).toBe(2);
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("EB05-031 Vinsmoke Reiju", () => {
  test("On Play DON!! -1 with a {The Vinsmoke Family} Leader trashes the top 10", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP06-042", hand: ["EB05-031"], deck: 12, activeDon: 6 },
      {},
    );
    const deck = south(e).deckCount;
    e.playCard("EB05-031", "south");
    e.accept("south");
    payReturnDon(e, 1);
    // The OP06-042 Leader draws 1 when a DON!! is returned; Reiju then trashes 10.
    expect(south(e).hand).toHaveLength(1);
    expect(south(e).deckCount).toBe(deck - 11);
    expect(south(e).trash).toHaveLength(10);
  });

  test("declining the DON!! -1 trashes nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP06-042", hand: ["EB05-031"], deck: 12, activeDon: 6 },
      {},
    );
    const donDeck = south(e).donDeckCount;
    e.playCard("EB05-031", "south");
    e.decline("south");
    expect(south(e).deckCount).toBe(12);
    expect(south(e).donDeckCount).toBe(donDeck);
  });

  test("Activate: Main trash this: against an 8000+ base power Character add up to 4 active DON!!", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-031"], activeDon: 0 },
      { character: ["EB01-041"] },
    );
    const donDeck = south(e).donDeckCount;
    e.activateMain("EB05-031", "south");
    e.accept("south");
    if (e.hasPendingChoice("south")) e.resolveDecision("effectAddDon", { optionId: "4" }, "south");
    expect(south(e).activeDon).toBe(4);
    expect(south(e).donDeckCount).toBe(donDeck - 4);
    expect(ids(south(e).trash)).toEqual(["EB05-031"]);
  });
});

describe("EB05-032 Ulti (no text from source: vanilla)", () => {
  test("plays as a 4-cost 6000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-032"], activeDon: 4 }, {});
    e.playCard("EB05-032", "south");
    expect(powerOf(e, "south", "EB05-032")).toBe(6000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-033 Nico Robin", () => {
  test("On Play with a Straw Hat Leader and 6+ fewer DON!!: draw 3, trash 2, add 4 rested DON!!", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB02-010", hand: ["EB05-033"], deck: 5, activeDon: 1 },
      { activeDon: 8 },
    );
    e.playCard("EB05-033", "south");
    const hand = e.getState().players.south.hand;
    expect(hand).toHaveLength(3);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: hand.slice(0, 2) }, "south");
    if (e.hasPendingChoice("south")) e.resolveDecision("effectAddDon", { optionId: "4" }, "south");
    expect(south(e).hand).toHaveLength(1);
    expect(south(e).restedDon).toBe(5);
  });

  test("On Play does nothing when the DON!! gap is under 6", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB02-010", hand: ["EB05-033"], deck: 5, activeDon: 3 },
      { activeDon: 8 },
    );
    e.playCard("EB05-033", "south");
    expect(south(e).deckCount).toBe(5);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-034 Sugar", () => {
  test("On Play DON!! -2 with 7+ DON!! left: an opposing Character gets -4000", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-034"], activeDon: 10 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-034", "south");
    e.accept("south");
    payReturnDon(e, 2);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(powerOf(e, "north", "EB01-018")).toBe(3000);
  });

  test("declining the DON!! -2 changes nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-034"], activeDon: 10 },
      { character: ["EB01-018"] },
    );
    const donDeck = south(e).donDeckCount;
    e.playCard("EB05-034", "south");
    e.decline("south");
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
    expect(south(e).donDeckCount).toBe(donDeck);
  });

  test("with only 6 DON!! after paying, nothing happens", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-034"], activeDon: 8 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-034", "south");
    e.accept("south");
    payReturnDon(e, 2);
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
  });
});

describe("EB05-035 Speed", () => {
  test("On Play DON!! -1: top 5, up to 2 {SMILE} cards to hand, then play up to 2 ≤5000-power {SMILE}", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["EB05-035"],
        deck: ["EB01-025", "OP02-077", "OP01-107", "EB01-005", "OP01-012", "EB01-018"],
        activeDon: 7,
      },
      {},
    );
    e.playCard("EB05-035", "south");
    e.accept("south");
    payReturnDon(e, 1);
    e.choose("effectSearchSelection", ["EB01-025", "OP01-107"], "south");
    keepRemainderOrder(e);
    expect(candidates(e, "effectPlaySelection")).toEqual(["EB01-025"]);
    e.choose("effectPlaySelection", ["EB01-025"], "south");
    expect(ids(south(e).characters)).toEqual(expect.arrayContaining(["EB05-035", "EB01-025"]));
    expect(ids(south(e).hand)).toEqual(["OP01-107"]);
  });

  test("declining the DON!! -1 searches nothing", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-035"], deck: 6, activeDon: 7 }, {});
    e.playCard("EB05-035", "south");
    e.decline("south");
    expect(south(e).deckCount).toBe(6);
    expect(south(e).hand).toEqual([]);
  });
});

describe("EB05-036 Tsuru", () => {
  test("On Play with a {Navy} Leader draws 1 and adds 1 rested DON!!", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP05-022", hand: ["EB05-036"], deck: 3, activeDon: 4 },
      {},
    );
    e.playCard("EB05-036", "south");
    if (e.hasPendingChoice("south")) e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(south(e).hand).toHaveLength(1);
    expect(south(e).restedDon).toBe(5);
  });

  test("On Play does nothing without a {Navy} Leader", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-036"], deck: 3, activeDon: 4 }, {});
    e.playCard("EB05-036", "south");
    expect(south(e).deckCount).toBe(3);
    expect(south(e).restedDon).toBe(4);
  });
});

describe("EB05-037 Black Maria", () => {
  test("On Play adds an {Animal Kingdom Pirates} card from the top 3", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-037"], deck: ["EB01-025", "EB01-005", "OP01-012", "EB01-018"], activeDon: 1 },
      {},
    );
    e.playCard("EB05-037", "south");
    expect(() => e.choose("effectSearchSelection", ["EB01-005"], "south")).toThrow();
    e.choose("effectSearchSelection", ["EB01-025"], "south");
    keepRemainderOrder(e);
    expect(ids(south(e).hand)).toEqual(["EB01-025"]);
    expect(south(e).deckCount).toBe(3);
  });
});

describe("EB05-038 Russian", () => {
  test("On Play: a [Senor Pink] gains +3000 this turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-038"], character: ["OP04-026", "EB01-005"], activeDon: 1 },
      {},
    );
    e.playCard("EB05-038", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["OP04-026"]);
    e.choose("effectTargetSelection", ["OP04-026"], "south");
    expect(powerOf(e, "south", "OP04-026")).toBe(8000);
    expect(powerOf(e, "south", "EB01-005")).toBe(3000);
  });
});

describe("EB05-039 Pink Hornet", () => {
  test("Main DON!! -1 with a {The Vinsmoke Family} Leader: an opposing Character gets -4000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP12-041", hand: ["EB05-039"], activeDon: 3 },
      { character: ["EB01-018"] },
    );
    const donDeck = south(e).donDeckCount;
    e.playCard("EB05-039", "south");
    e.accept("south");
    payReturnDon(e, 1);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(powerOf(e, "north", "EB01-018")).toBe(3000);
    expect(south(e).donDeckCount).toBe(donDeck + 1);
  });

  test("declining the Main changes nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP12-041", hand: ["EB05-039"], activeDon: 3 },
      { character: ["EB01-018"] },
    );
    const donDeck = south(e).donDeckCount;
    e.playCard("EB05-039", "south");
    e.decline("south");
    expect(powerOf(e, "north", "EB01-018")).toBe(7000);
    expect(south(e).donDeckCount).toBe(donDeck);
  });

  test("Counter DON!! -1: the Leader gains +4000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-039"], activeDon: 2 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-039");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.accept("south");
    payReturnDon(e, 1);
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("EB05-040 You Need Me, Don't You?!!", () => {
  test("Main: return 1 active DON!! with a {Donquixote Pirates} Leader: draw 3, trash 1", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP05-022", hand: ["EB05-040"], deck: 5, activeDon: 2 },
      {},
    );
    const donDeck = south(e).donDeckCount;
    e.playCard("EB05-040", "south");
    e.accept("south");
    payReturnDon(e, 1);
    const hand = e.getState().players.south.hand;
    expect(hand).toHaveLength(3);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [hand[0]!] }, "south");
    expect(south(e).hand).toHaveLength(2);
    expect(south(e).donDeckCount).toBe(donDeck + 1);
  });

  test("declining draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP05-022", hand: ["EB05-040"], deck: 5, activeDon: 2 },
      {},
    );
    e.playCard("EB05-040", "south");
    e.decline("south");
    expect(south(e).deckCount).toBe(5);
    expect(south(e).activeDon).toBe(2);
  });

  test("Counter: the Leader gains +2000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-040"] },
      { character: [{ card: { id: "EB01-005" }, playedOnTurn: 0 }], activeDon: 3 },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-040");
    e.attachDon(e.findCardInZone("north", "character", "EB01-005"), 3, "north");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-005"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("EB05-041 Koala (no text from source: vanilla)", () => {
  test("plays as a 2-cost 4000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-041"], activeDon: 2 }, {});
    e.playCard("EB05-041", "south");
    expect(powerOf(e, "south", "EB05-041")).toBe(4000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-042 Shinobu", () => {
  test("On Play draws 2 and trashes 2", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-042", "EB01-005"], deck: 4, activeDon: 4 },
      {},
    );
    e.playCard("EB05-042", "south");
    const hand = e.getState().players.south.hand;
    expect(hand).toHaveLength(3);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: hand.slice(0, 2) }, "south");
    expect(south(e).hand).toHaveLength(1);
    expect(south(e).trash).toHaveLength(2);
    expect(south(e).deckCount).toBe(2);
  });
});

describe("EB05-043 Perona", () => {
  test.each([
    ["0", "trash"],
    ["1", "rested"],
  ] as const)(
    "On K.O. option %s: K.O. or rest a cost 6 or less Character (%s)",
    (optionId, result) => {
      const e = OnePieceTestEngine.create(
        { character: [{ card: { id: "EB05-043" }, rested: true }] },
        { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }, "EB01-018"] },
        { activeSeat: "north" },
      );
      northAttacksSouthCharacter(e, "EB05-043");
      e.resolveDecision("effectActionChoice", { optionId }, "south");
      e.choose("effectTargetSelection", ["EB01-018"], "south");
      if (result === "trash") {
        expect(ids(north(e).trash)).toEqual(["EB01-018"]);
      } else {
        expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
      }
    },
  );
});

describe("EB05-044 Ms. Father's Day", () => {
  test("On Play with a Baroque Works Leader and an opposing cost 0 Character: opposing Leader -1000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP14-079", hand: ["EB05-044"], character: ["OP02-053"], activeDon: 2 },
      { character: ["EB01-005"] },
    );
    // The OP14-079 Leader K.O.s OP02-053 to give EB01-005 -10 cost (cost 0).
    e.activateMain(e.leader("south"), "south");
    e.accept("south");
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-005")?.cost).toBe(0);
    e.playCard("EB05-044", "south");
    expect(north(e).leader?.power).toBe(4000);
  });

  test("On Play does nothing when no opposing Character costs 0", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP14-079", hand: ["EB05-044"], activeDon: 2 },
      { character: ["EB01-005"] },
    );
    e.playCard("EB05-044", "south");
    expect(north(e).leader?.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-045 Ms. Monday", () => {
  test("On Play K.O.s up to 1 of your Baroque Works Characters", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-045"], character: ["OP02-053", "EB01-005"], activeDon: 2 },
      {},
    );
    e.playCard("EB05-045", "south");
    expect(candidates(e, "effectTargetSelection").sort(byText)).toEqual(["EB05-045", "OP02-053"]);
    e.choose("effectTargetSelection", ["OP02-053"], "south");
    expect(ids(south(e).trash)).toEqual(["OP02-053"]);
  });

  test("On K.O. adds a Baroque Works card from the top 3 and trashes the rest", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "EB05-045" }, rested: true }],
        deck: ["OP09-055", "EB01-005", "OP01-012", "EB01-018"],
      },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    northAttacksSouthCharacter(e, "EB05-045");
    e.choose("effectSearchSelection", ["OP09-055"], "south");
    expect(ids(south(e).hand)).toEqual(["OP09-055"]);
    expect(south(e).trash).toHaveLength(3);
    expect(south(e).deckCount).toBe(1);
  });
});

describe("EB05-046 Yamato", () => {
  test("against an 8000+ base power Character it gains [Blocker] and +3000", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-046"] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    expect(powerOf(e, "south", "EB05-046")).toBe(8000);
    e.declareAttack(e.findCardInZone("north", "character", "EB01-041"), e.leader("south"), "north");
    if (
      e
        .getState()
        .promptQueue.some(
          (p) => p.status === "pending" && p.resolutionContext?.intent === "effectOptional",
        )
    ) {
      e.decline("south");
    }
    expect(candidates(e, "battleBlocker").filter(Boolean)).toEqual(["EB05-046"]);
  });

  test("without one it stays 5000 power", () => {
    const e = OnePieceTestEngine.create({ character: ["EB05-046"] }, { character: ["EB01-018"] });
    expect(powerOf(e, "south", "EB05-046")).toBe(5000);
  });

  test("On Your Opponent's Attack: trash 1 with 10+ trash: Leader base power becomes 7000", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-046"], hand: ["EB01-005"], trash: 10 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.accept("south");
    expect(south(e).leader?.power).toBe(7000);
    expect(south(e).lifeCount).toBe(life - 1);
  });

  test("declining keeps the hand and the Leader at 5000", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-046"], hand: ["EB01-005"], trash: 10 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.decline("south");
    expect(south(e).leader?.power).toBe(5000);
    expect(ids(south(e).hand)).toEqual(["EB01-005"]);
  });
});

describe("EB05-048 Hedgehog Stinger", () => {
  test("Main: rest 1 DON!! and K.O. a Baroque Works Character: cost 0 Characters cannot [Blocker]", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["EB05-049", "EB05-048"],
        character: ["OP02-054", "OP02-053", { card: { id: "EB01-018" }, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: ["OP02-081"] },
    );
    // Special Hollow makes the cost 2 [Blocker] OP02-081 cost 0 first.
    e.playCard("EB05-049", "south");
    e.accept("south");
    e.choose("effectTargetSelection", ["OP02-081"], "south");
    e.playCard("EB05-048", "south");
    e.accept("south");
    expect(ids(south(e).trash)).toContain("OP02-053");
    expect(south(e).restedDon).toBe(3);
    e.declareAttack(e.findCardInZone("south", "character", "EB01-018"), e.leader("north"), "south");
    expect(
      e
        .getState()
        .promptQueue.some(
          (p) => p.status === "pending" && p.resolutionContext?.intent === "battleBlocker",
        ),
    ).toBe(false);
  });

  test("declining keeps the Baroque Works Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-048"], character: ["OP02-053"], activeDon: 2 },
      {},
    );
    e.playCard("EB05-048", "south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP02-053");
    expect(south(e).activeDon).toBe(1);
  });

  test("Counter: the Leader gains +3000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-048"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-048");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("EB05-049 Special Hollow", () => {
  test("Main: K.O. a {Thriller Bark Pirates} Character: an opposing Character gets -3 cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-049"], character: ["OP02-054"], activeDon: 1 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-049", "south");
    e.accept("south");
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.cost).toBe(2);
    expect(ids(south(e).trash)).toContain("OP02-054");
  });

  test("declining keeps the Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-049"], character: ["OP02-054"], activeDon: 1 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-049", "south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP02-054");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.cost).toBe(5);
  });

  test("Counter: K.O. a {Thriller Bark Pirates} Character: +4000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-049"], character: ["OP02-054"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-049");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.accept("south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).lifeCount).toBe(life);
    expect(ids(south(e).trash)).toContain("OP02-054");
  });
});

describe("EB05-050 Atlas", () => {
  const deck = ["EB02-029", "EB01-005", "OP01-012", "EB01-018", "EB01-005"];
  test("On Play adds a Wisdom attribute card from the top 4", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-050"], deck, activeDon: 1 }, {});
    e.playCard("EB05-050", "south");
    expect(() => e.choose("effectSearchSelection", ["OP01-012"], "south")).toThrow();
    e.choose("effectSearchSelection", ["EB02-029"], "south");
    keepRemainderOrder(e);
    expect(ids(south(e).hand)).toEqual(["EB02-029"]);
  });

  test("Trigger activates the On Play effect", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-050", "EB01-005"], deck },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.choose("effectSearchSelection", ["EB02-029"], "south");
    keepRemainderOrder(e);
    expect(ids(south(e).hand)).toEqual(["EB02-029"]);
  });
});

describe("EB05-051 Ahiru", () => {
  test("On Play rests a Character with cost ≤ both players' total Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-051"], life: 2, activeDon: 3 },
      { life: 3, character: ["EB01-018", "EB01-055"] },
    );
    e.playCard("EB05-051", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(north(e).characters.find((c) => c?.cardId === "EB01-018")?.rested).toBe(true);
  });

  test("Trigger plays this card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-051", "EB01-005"] },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(ids(south(e).characters)).toContain("EB05-051");
  });
});

describe("EB05-054 Charlotte Brulee", () => {
  test("Trigger plays up to 2 {Big Mom Pirates} Characters with 4000 power from hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-054", "EB01-005"], hand: ["OP03-103", "ST07-006", "OP01-012"] },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(candidates(e, "effectPlaySelection").sort(byText)).toEqual(["OP03-103", "ST07-006"]);
    e.choose("effectPlaySelection", ["OP03-103", "ST07-006"], "south");
    expect(ids(south(e).characters)).toEqual(expect.arrayContaining(["OP03-103", "ST07-006"]));
  });
});

describe("EB05-058 Bell-mere (no text from source: vanilla)", () => {
  test("plays as a 4-cost 6000-power Character with no prompt", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-058"], activeDon: 4 }, {});
    e.playCard("EB05-058", "south");
    expect(powerOf(e, "south", "EB05-058")).toBe(6000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-059 Charlotte Pudding!!", () => {
  test("Main draws 1; 4000 base power {Big Mom Pirates} Characters cannot be K.O.'d in battle", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["EB05-059"],
        character: [
          { card: { id: "OP03-103" }, rested: true },
          { card: { id: "OP01-012" }, rested: true },
        ],
        deck: 3,
        activeDon: 1,
      },
      {
        character: [
          { card: { id: "EB01-041" }, playedOnTurn: 0 },
          { card: { id: "EB01-055" }, playedOnTurn: 0 },
        ],
      },
    );
    e.playCard("EB05-059", "south");
    expect(south(e).hand).toHaveLength(1);
    e.endTurn("south");
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "OP03-103"),
      "north",
    );
    if (e.hasPendingChoice("south"))
      e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(ids(south(e).characters)).toContain("OP03-103");
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-055"),
      e.findCardInZone("south", "character", "OP01-012"),
      "north",
    );
    if (e.hasPendingChoice("south"))
      e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(ids(south(e).trash)).toContain("OP01-012");
  });

  test("Trigger draws 1 and plays a 4000-power Character with a [Trigger] from hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-059", "EB01-005"], hand: ["OP03-033", "OP03-103"], deck: 3 },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP03-033"]);
    e.choose("effectPlaySelection", ["OP03-033"], "south");
    expect(ids(south(e).characters)).toContain("OP03-033");
    expect(south(e).deckCount).toBe(2);
  });
});

describe("EB05-060 Take Care of Lilith!!!", () => {
  test("Main: trash a cost 5+ {Egghead} Character to add the top deck card to Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-060"], character: ["OP13-101"], deck: 3, activeDon: 1 },
      {},
    );
    const life = south(e).lifeCount;
    e.playCard("EB05-060", "south");
    e.accept("south");
    if (e.hasPendingChoice("south")) {
      e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    }
    expect(south(e).lifeCount).toBe(life + 1);
    expect(ids(south(e).trash)).toContain("OP13-101");
  });

  test("declining keeps the Character and the Life", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-060"], character: ["OP13-101"], deck: 3, activeDon: 1 },
      {},
    );
    const life = south(e).lifeCount;
    e.playCard("EB05-060", "south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP13-101");
    expect(south(e).lifeCount).toBe(life);
  });

  test("Counter: turn a Life face-up: +4000 this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-060"], activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    const eventId = e.findCardInZone("south", "hand", "EB05-060");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.accept("south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).lifeCount).toBe(life);
    expect(e.getState().cards[e.getState().players.south.life[0]!]?.faceUp).toBe(true);
  });
});

describe("EB05-061 Nami", () => {
  test("On Play plays a red cost 2 or less Character from hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-061", "EB01-005", "EB01-018"], activeDon: 3 },
      {},
    );
    e.playCard("EB05-061", "south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["EB01-005"]);
    e.choose("effectPlaySelection", ["EB01-005"], "south");
    expect(ids(south(e).characters)).toContain("EB01-005");
  });

  test("once per turn, a K.O. in battle is replaced by adding the top Life card to hand", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          "EB05-061",
          { card: { id: "EB01-005" }, rested: true },
          { card: { id: "OP01-012" }, rested: true },
        ],
      },
      {
        character: [
          { card: { id: "EB01-041" }, playedOnTurn: 0 },
          { card: { id: "EB01-018" }, playedOnTurn: 0 },
        ],
      },
      { activeSeat: "north" },
    );
    const life = south(e).lifeCount;
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "EB01-005"),
      "north",
    );
    e.resolveDecision("battleKoReplacement", { optionId: "yes" }, "south");
    expect(ids(south(e).characters)).toContain("EB01-005");
    expect(south(e).lifeCount).toBe(life - 1);
    expect(south(e).hand).toHaveLength(1);
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-018"),
      e.findCardInZone("south", "character", "OP01-012"),
      "north",
    );
    if (e.hasPendingChoice("south"))
      e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(ids(south(e).trash)).toEqual(["OP01-012"]);
  });

  test("an opponent's effect K.O. is replaced too; declining lets it happen", () => {
    const make = () =>
      OnePieceTestEngine.create(
        { character: ["EB05-061", "EB05-012"] },
        { hand: ["OP13-013"], activeDon: 3 },
        { activeSeat: "north" },
      );
    const e = make();
    const life = south(e).lifeCount;
    e.playCard("OP13-013", "north");
    e.choose(
      "effectTargetSelection",
      [e.findCardInZone("south", "character", "EB05-012")],
      "north",
    );
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(ids(south(e).characters)).toContain("EB05-012");
    expect(south(e).lifeCount).toBe(life - 1);

    const d = make();
    d.playCard("OP13-013", "north");
    d.choose(
      "effectTargetSelection",
      [d.findCardInZone("south", "character", "EB05-012")],
      "north",
    );
    d.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");
    expect(ids(south(d).trash)).toEqual(["EB05-012"]);
    expect(south(d).lifeCount).toBe(life);
  });
});
