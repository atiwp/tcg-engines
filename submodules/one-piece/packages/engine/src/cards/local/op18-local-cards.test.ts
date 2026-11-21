// OP Practice local cards (fork-only): command-driven proofs for the OP18 definitions in
// packages/cards/src/cards/local/. Unsupported clauses are listed in local/LOCAL-CARDS.md.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../index.ts";

type Engine = OnePieceTestEngine;

const ids = (cards: ReadonlyArray<{ cardId?: string | null } | null | undefined>) =>
  cards.map((card) => card?.cardId);
const byText = (left: string | null | undefined, right: string | null | undefined) =>
  String(left).localeCompare(String(right));
const candidates = (e: Engine, intent: Parameters<Engine["pendingDecision"]>[0]) => {
  const step = e.pendingDecision(intent, "south").steps.find((s) => s.kind === "selectEntity");
  if (step?.kind !== "selectEntity") throw new Error(`Expected a ${intent} selection.`);
  return step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId);
};
const south = (e: Engine) => e.getView("south").players.south;

describe("OP18-060 Saint Gunko (Leader)", () => {
  test("once per turn, a Character played from your trash draws 2 then trashes 1", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP18-060",
        hand: ["OP18-096", "EB01-005"],
        trash: ["OP18-085"],
        deck: 5,
        activeDon: 4,
      },
      {},
    );
    e.playCard("OP18-096", "south");
    e.accept("south");
    e.choose("effectPlaySelection", ["OP18-085"], "south");
    expect(south(e).hand).toHaveLength(3);
    const discard = e.findCardInZone("south", "hand", "EB01-005");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discard] }, "south");
    const view = south(e);
    expect(ids(view.characters)).toContain("OP18-085");
    expect(view.hand).toHaveLength(2);
    expect(view.deckCount).toBe(3);
    expect(ids(view.trash)).toContain("EB01-005");
  });

  test("a Character played from hand does not trigger it", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["OP18-085"], deck: 5, activeDon: 1 },
      {},
    );
    e.playCard("OP18-085", "south");
    expect(south(e).deckCount).toBe(5);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Activate: Main trash 1 with an 8000+ base power Character adds 1 active DON!!", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["EB01-005", "OP01-012"], character: ["OP18-119"] },
      {},
    );
    const before = south(e);
    e.activateMain("OP18-060", "south");
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    if (e.hasPendingChoice("south")) {
      e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    }
    const view = south(e);
    expect(view.activeDon).toBe(before.activeDon + 1);
    expect(view.donDeckCount).toBe(before.donDeckCount - 1);
    expect(ids(view.hand)).toEqual(["OP01-012"]);
  });

  test("Activate: Main without an 8000+ base power Character adds no DON!!", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["EB01-005", "OP01-012"], character: ["OP18-088"] },
      {},
    );
    const before = south(e);
    e.activateMain("OP18-060", "south");
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    expect(south(e).activeDon).toBe(before.activeDon);
    expect(south(e).donDeckCount).toBe(before.donDeckCount);
  });

  test("declining the Activate: Main keeps the hand and DON!!", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["EB01-005"], character: ["OP18-119"] },
      {},
    );
    const before = south(e);
    e.activateMain("OP18-060", "south");
    e.decline("south");
    expect(ids(south(e).hand)).toEqual(["EB01-005"]);
    expect(south(e).donDeckCount).toBe(before.donDeckCount);
  });
});

describe("OP18-095 I'm Late, I'm Very Late!!", () => {
  const deck = ["EB01-005", "OP18-093", "OP18-083", "OP01-012", "EB01-018", "EB01-005"];

  test("Main with a Celestial Dragons Leader adds a Sleeptids or Holy Knights of God card", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["OP18-095"], deck, activeDon: 1 },
      {},
    );
    e.playCard("OP18-095", "south");
    e.choose("effectSearchSelection", ["OP18-093"], "south");
    const view = south(e);
    expect(ids(view.hand)).toEqual(["OP18-093"]);
    expect(view.deckCount).toBe(5);
  });

  test("Main does nothing without a Celestial Dragons Leader", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-095"], deck, activeDon: 1 }, {});
    e.playCard("OP18-095", "south");
    expect(south(e).hand).toEqual([]);
    expect(south(e).deckCount).toBe(6);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Trigger activates the Main effect", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", life: ["OP18-095", "EB01-005"], deck },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.choose("effectSearchSelection", ["OP18-083"], "south");
    expect(ids(south(e).hand)).toEqual(["OP18-083"]);
  });
});

describe("OP18-096 I'll Make the Call", () => {
  test("Main: rest 3 DON!! to play a cost 6 or less Holy Knights of God Character from trash", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-096"], trash: ["OP18-088", "OP18-119"], activeDon: 4 },
      {},
    );
    e.playCard("OP18-096", "south");
    e.accept("south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP18-088"]);
    e.choose("effectPlaySelection", ["OP18-088"], "south");
    const view = south(e);
    expect(ids(view.characters)).toContain("OP18-088");
    expect(view.activeDon).toBe(0);
  });

  test("declining the Main cost plays nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-096"], trash: ["OP18-088"], activeDon: 4 },
      {},
    );
    e.playCard("OP18-096", "south");
    e.decline("south");
    const view = south(e);
    expect(view.activeDon).toBe(3);
    expect(ids(view.characters).filter(Boolean)).toEqual([]);
    expect(ids(view.trash).sort(byText)).toEqual(["OP18-088", "OP18-096"]);
  });

  test("Counter with 10 or more trash cards gives +4000 during this battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-096"], trash: 10, activeDon: 1 },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const eventId = e.findCardInZone("south", "hand", "OP18-096");
    const life = south(e).lifeCount;
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [eventId] }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(south(e).lifeCount).toBe(life);
  });
});

describe("OP18-084 Saint Gunko", () => {
  test("On Play adds a Holy Knights of God card from the top 4 and trashes the rest", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["OP18-084"],
        deck: ["EB01-005", "OP18-083", "OP01-012", "EB01-018", "EB01-005"],
        activeDon: 1,
      },
      {},
    );
    e.playCard("OP18-084", "south");
    e.choose("effectSearchSelection", ["OP18-083"], "south");
    const view = south(e);
    expect(ids(view.hand)).toEqual(["OP18-083"]);
    expect(view.deckCount).toBe(1);
    expect(ids(view.trash).sort(byText)).toEqual(["EB01-005", "EB01-018", "OP01-012"]);
  });

  test("Activate: Main rests 4 DON!! to play a Holy Knights of God Character from trash", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-084"], trash: ["OP18-064", "EB01-005"], activeDon: 4 },
      {},
    );
    e.activateMain("OP18-084", "south");
    e.accept("south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP18-064"]);
    e.choose("effectPlaySelection", ["OP18-064"], "south");
    expect(ids(south(e).characters)).toContain("OP18-064");
    expect(south(e).activeDon).toBe(0);
  });

  test("declining the Activate: Main keeps the DON!! active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-084"], trash: ["OP18-064"], activeDon: 4 },
      {},
    );
    e.activateMain("OP18-084", "south");
    e.decline("south");
    expect(south(e).activeDon).toBe(4);
    expect(ids(south(e).trash)).toEqual(["OP18-064"]);
  });
});

describe("OP18-085 Cerberus", () => {
  test.each([
    ["0", "rush"],
    ["1", "banish"],
    ["2", "unblockable"],
  ])("return to hand: Saint Shamrock gains option %s (%s) this turn", (optionId, keyword) => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-085", { card: { id: "OP18-119" }, playedOnTurn: 0 }] },
      {},
    );
    e.activateMain("OP18-085", "south");
    e.accept("south");
    e.resolveDecision("effectActionChoice", { optionId }, "south");
    if (e.hasPendingChoice("south")) e.choose("effectTargetSelection", ["OP18-119"], "south");
    expect(ids(south(e).hand)).toEqual(["OP18-085"]);
    const shamrock = e.findCardInZone("south", "character", "OP18-119");
    const granted = Object.values(e.getState().modifiers).filter(
      (m) => JSON.stringify(m).includes(shamrock) && JSON.stringify(m).includes(`"${keyword}"`),
    );
    expect(granted).toHaveLength(1);
  });

  test("declining keeps Cerberus on the field", () => {
    const e = OnePieceTestEngine.create({ character: ["OP18-085", "OP18-119"] }, {});
    e.activateMain("OP18-085", "south");
    e.decline("south");
    expect(ids(south(e).characters)).toContain("OP18-085");
    expect(south(e).hand).toEqual([]);
  });
});

describe("OP18-064 Saint Killingham", () => {
  test("Your Turn On Play DON!! -1: two opposing Characters cannot attack", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-064"], activeDon: 6 },
      { character: ["EB01-018", "EB01-005", "EB01-041"] },
    );
    const before = south(e);
    e.playCard("OP18-064", "south");
    e.accept("south");
    if (e.hasPendingChoice("south")) {
      const step = e.pendingDecision("effectCostReturnDon", "south").steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected a DON!! return.");
      e.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: [step.candidates[0]!.ref.id] },
        "south",
      );
    }
    expect(candidates(e, "effectTargetSelection").sort(byText)).toEqual(["EB01-005", "EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-005"]);
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    expect(south(e).donDeckCount).toBe(before.donDeckCount + 1);
    const restricted = ["EB01-018", "EB01-005"].map((id) =>
      e.findCardInZone("north", "character", id),
    );
    const flags = Object.values(e.getState().modifiers).map((m) => JSON.stringify(m));
    for (const id of restricted) expect(flags.some((m) => m.includes(id))).toBe(true);
  });

  test("known gap (LOCAL-CARDS.md): the second pick may repeat the first Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-064"], activeDon: 6 },
      { character: ["EB01-018", "EB01-005"] },
    );
    e.playCard("OP18-064", "south");
    e.accept("south");
    if (e.hasPendingChoice("south")) {
      const step = e.pendingDecision("effectCostReturnDon", "south").steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected a DON!! return.");
      e.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: [step.candidates[0]!.ref.id] },
        "south",
      );
    }
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    // cannotAttack has no targetGroups, so the 5000-or-less pick is not forced to differ.
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-005"]);
    e.choose("effectTargetSelection", [], "south");
    expect(e.hasPendingChoice("south")).toBe(false);
  });

  test("declining the DON!! -1 restricts nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-064"], activeDon: 6 },
      { character: ["EB01-018"] },
    );
    const before = south(e);
    e.playCard("OP18-064", "south");
    e.decline("south");
    expect(south(e).donDeckCount).toBe(before.donDeckCount);
    expect(Object.keys(e.getState().modifiers)).toHaveLength(0);
  });

  test("On K.O. DON!! -1 plays this Character from trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-064" }, rested: true }], restedDon: 2 },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "OP18-064"),
      "north",
    );
    e.accept("south");
    if (e.hasPendingChoice("south")) {
      const step = e.pendingDecision("effectCostReturnDon", "south").steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected a DON!! return.");
      e.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: [step.candidates[0]!.ref.id] },
        "south",
      );
    }
    expect(ids(south(e).characters)).toContain("OP18-064");
    expect(south(e).restedDon).toBe(1);
  });
});

/** North's 8000-power Character attacks South's rested Character, which is K.O.'d. */
function koSouthCharacter(e: Engine, cardId: string): void {
  e.declareAttack(
    e.findCardInZone("north", "character", "EB01-041"),
    e.findCardInZone("south", "character", cardId),
    "north",
  );
  e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
}

describe("OP18-083 Saint Killingham", () => {
  test("Your Turn On Play plays a Sleeptids from trash", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-083"], trash: ["OP18-093", "EB01-005"], activeDon: 5 },
      {},
    );
    e.playCard("OP18-083", "south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP18-093"]);
    e.choose("effectPlaySelection", ["OP18-093"], "south");
    expect(ids(south(e).characters)).toEqual(expect.arrayContaining(["OP18-083", "OP18-093"]));
  });

  test("On K.O. trash 2 from hand to play this Character from trash", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP18-083" }, rested: true }],
        hand: ["EB01-005", "OP01-012", "OP01-036"],
      },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    koSouthCharacter(e, "OP18-083");
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005", "OP01-012"], "south");
    expect(ids(south(e).characters)).toContain("OP18-083");
    expect(ids(south(e).hand)).toEqual(["OP01-036"]);
  });

  test("declining the On K.O. leaves it in trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-083" }, rested: true }], hand: ["EB01-005", "OP01-012"] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    koSouthCharacter(e, "OP18-083");
    e.decline("south");
    expect(ids(south(e).trash)).toEqual(["OP18-083"]);
    expect(ids(south(e).hand)).toEqual(["EB01-005", "OP01-012"]);
  });
});

describe("OP18-088 Saint Sommers", () => {
  test("Your Turn On Play with 6+ DON!! K.O.s an opposing base cost 4 or less Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-088"], activeDon: 6 },
      { character: ["EB01-018", "EB01-005"] },
    );
    e.playCard("OP18-088", "south");
    expect(candidates(e, "effectTargetSelection")).toEqual(["EB01-005"]);
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    expect(ids(e.getView("north").players.north.trash)).toEqual(["EB01-005"]);
  });

  test("On Play does nothing with 5 DON!! on the field", () => {
    // Abyss Pentagram makes Sommers cost 5, so 5 DON!! are enough to play it.
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["OP18-088"], stage: "OP18-097", activeDon: 5 },
      { character: ["EB01-005"] },
    );
    e.playCard("OP18-088", "south");
    expect(ids(south(e).characters)).toContain("OP18-088");
    expect(e.getView("north").players.north.trash).toEqual([]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("On K.O. trash 2 from hand to play this Character from trash", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP18-088" }, rested: true }],
        hand: ["EB01-005", "OP01-012", "OP01-036"],
      },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    koSouthCharacter(e, "OP18-088");
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005", "OP01-012"], "south");
    expect(ids(south(e).characters)).toContain("OP18-088");
    expect(ids(south(e).trash).sort(byText)).toEqual(["EB01-005", "OP01-012"]);
  });

  test("declining the On K.O. leaves it in trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-088" }, rested: true }], hand: ["EB01-005", "OP01-012"] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "OP18-088"),
      "north",
    );
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.decline("south");
    expect(ids(south(e).trash)).toEqual(["OP18-088"]);
    expect(ids(south(e).hand)).toEqual(["EB01-005", "OP01-012"]);
  });
});

describe("OP18-119 Saint Shamrock", () => {
  test("Activate: Main on the turn it was played plays a Holy Knights of God Character from trash once", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-119"], trash: ["OP18-083", "OP18-084"], activeDon: 8 },
      {},
    );
    e.playCard("OP18-119", "south");
    e.activateMain("OP18-119", "south");
    e.choose("effectPlaySelection", ["OP18-084"], "south");
    if (e.hasPendingChoice("south")) e.choose("effectSearchSelection", [], "south");
    expect(ids(south(e).characters)).toEqual(expect.arrayContaining(["OP18-119", "OP18-084"]));
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "OP18-119"),
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("Activate: Main does nothing if it was not played this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-119" }, playedOnTurn: 0 }], trash: ["OP18-083"] },
      {},
    );
    const result = e.getState();
    expect(result.players.south.trash).toHaveLength(1);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "OP18-119"),
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("On K.O. trash 1 from hand to play this Character from trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-119" }, rested: true }], hand: ["EB01-005", "OP01-012"] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }], activeDon: 2 },
      { activeSeat: "north" },
    );
    // 9000 power: North attacks with a 9000+ attacker plus DON!!.
    e.attachDon(e.findCardInZone("north", "character", "EB01-041"), 2, "north");
    koSouthCharacter(e, "OP18-119");
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    expect(ids(south(e).characters)).toContain("OP18-119");
    expect(ids(south(e).hand)).toEqual(["OP01-012"]);
  });

  test("declining the On K.O. leaves it in trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "OP18-119" }, rested: true }], hand: ["EB01-005"] },
      { character: [{ card: { id: "EB01-041" }, playedOnTurn: 0 }], activeDon: 2 },
      { activeSeat: "north" },
    );
    e.attachDon(e.findCardInZone("north", "character", "EB01-041"), 2, "north");
    e.declareAttack(
      e.findCardInZone("north", "character", "EB01-041"),
      e.findCardInZone("south", "character", "OP18-119"),
      "north",
    );
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.decline("south");
    expect(ids(south(e).trash)).toEqual(["OP18-119"]);
    expect(ids(south(e).hand)).toEqual(["EB01-005"]);
  });
});

describe("OP18-093 Sleeptids", () => {
  test("has [Blocker]: it can become the new target of an attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP18-093"] },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const blocker = e.findCardInZone("south", "character", "OP18-093");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    expect(candidates(e, "battleBlocker").filter(Boolean)).toEqual(["OP18-093"]);
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "south");
    expect(ids(south(e).trash)).toEqual(["OP18-093"]);
    expect(south(e).lifeCount).toBe(e.getState().players.south.life.length);
  });
});

describe("OP18-065 Saint Gunko", () => {
  test("On Play DON!! -1 plays a Celestial Dragons Character with 6000 power or less from trash", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-065"], trash: ["OP18-085", "OP18-084", "OP18-119"], activeDon: 10 },
      {},
    );
    const before = south(e);
    e.playCard("OP18-065", "south");
    e.accept("south");
    expect(candidates(e, "effectPlaySelection")).toEqual(["OP18-084"]);
    e.choose("effectPlaySelection", ["OP18-084"], "south");
    if (e.hasPendingChoice("south")) e.choose("effectSearchSelection", [], "south");
    expect(ids(south(e).characters)).toEqual(expect.arrayContaining(["OP18-065", "OP18-084"]));
    expect(south(e).donDeckCount).toBe(before.donDeckCount + 1);
  });

  test("declining the DON!! -1 plays nothing", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-065"], trash: ["OP18-084"], activeDon: 10 },
      {},
    );
    const before = south(e);
    e.playCard("OP18-065", "south");
    e.decline("south");
    expect(south(e).donDeckCount).toBe(before.donDeckCount);
    expect(ids(south(e).trash)).toEqual(["OP18-084"]);
    expect(e.getState().cards[e.findCardInZone("south", "character", "OP18-065")]?.cardId).toBe(
      "OP18-065",
    );
  });
});

describe("OP18-097 Abyss Pentagram", () => {
  test("On Play draws 1 and trashes 2 from the top of the deck", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP18-097"], deck: 5, activeDon: 1 }, {});
    e.playCard("OP18-097", "south");
    const view = south(e);
    expect(view.hand).toHaveLength(1);
    expect(view.deckCount).toBe(2);
    expect(view.trash).toHaveLength(2);
  });

  test("with a Celestial Dragons Leader, Holy Knights of God Characters cost 1 less from hand", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP18-060", hand: ["OP18-088"], stage: "OP18-097", activeDon: 5 },
      {},
    );
    e.playCard("OP18-088", "south");
    expect(ids(south(e).characters)).toContain("OP18-088");
    expect(south(e).activeDon).toBe(0);
  });

  test("without a Celestial Dragons Leader there is no reduction", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP18-088"], stage: "OP18-097", activeDon: 5 },
      {},
    );
    expect(
      e.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: e.findCardInZone("south", "hand", "OP18-088"),
      }).accepted,
    ).toBe(false);
  });
});
