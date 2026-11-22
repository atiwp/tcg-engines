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
