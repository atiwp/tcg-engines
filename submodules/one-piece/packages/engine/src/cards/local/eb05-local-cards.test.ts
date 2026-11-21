// OP Practice local cards (fork-only): command-driven proofs for the EB05 definitions in
// packages/cards/src/cards/local/. Unsupported clauses are listed in local/LOCAL-CARDS.md.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../index.ts";

type Engine = OnePieceTestEngine;

const ids = (cards: ReadonlyArray<{ cardId?: string | null } | null | undefined>) =>
  cards.map((card) => card?.cardId);
const byText = (left: string | null | undefined, right: string | null | undefined) =>
  String(left).localeCompare(String(right));

/** North's Leader attacks South's Leader; South takes no counters and reveals its top Life. */
function hitSouthLeaderAndActivateTrigger(e: Engine): void {
  e.declareAttack(e.leader("north"), e.leader("south"), "north");
  if (e.hasPendingChoice("south")) {
    const intents = e
      .getState()
      .promptQueue.filter((p) => p.status === "pending" && p.seat === "south")
      .map((p) => p.resolutionContext?.intent);
    if (intents.includes("battleCounter")) {
      e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    }
  }
  e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
}

describe("EB05-001 Jewelry Bonney", () => {
  test("On Play with a Supernovas Leader draws 2 and plays up to 2 Characters with 2000 power or less", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-001",
        hand: ["EB05-001", "EB01-018"],
        deck: ["OP02-081", "OP03-065", "EB01-005"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("EB05-001", "south");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Bonney's play selection.");
    expect(step.max).toBe(2);
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId).sort(byText)).toEqual([
      "OP02-081",
      "OP03-065",
    ]);
    e.choose("effectPlaySelection", ["OP02-081", "OP03-065"], "south");

    const view = e.getView("south");
    expect(ids(view.players.south.characters)).toEqual(
      expect.arrayContaining(["EB05-001", "OP02-081", "OP03-065"]),
    );
    expect(ids(view.players.south.hand)).toEqual(["EB01-018"]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("On Play does nothing without a Supernovas Leader", () => {
    const e = OnePieceTestEngine.create(
      // EB05-010 Nico Robin has only the {Straw Hat Crew} type.
      {
        leaderCardId: "EB05-010",
        hand: ["EB05-001"],
        deck: ["OP02-081", "OP03-065"],
        activeDon: 5,
      },
      {},
    );
    e.playCard("EB05-001", "south");
    const view = e.getView("south");
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("Activate: Main gives an opposing 6000+ power card -1000 power until the opponent's next End Phase", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB05-001"] },
      { character: ["EB01-018", "EB01-005"] },
    );
    const godId = e.findCardInZone("north", "character", "EB01-018");
    e.activateMain("EB05-001", "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Bonney's power target.");
    const targets = step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId);
    expect(targets).toContain("EB01-018");
    expect(targets).not.toContain("EB01-005");
    e.resolveDecision("effectTargetSelection", { selectedIds: [godId] }, "south");
    const power = () =>
      e.getView("south").players.north.characters.find((c) => c?.instanceId === godId)?.power;
    expect(power()).toBe(6000);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: e.findCardInZone("south", "character", "EB05-001"),
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    e.endTurn("south");
    expect(power()).toBe(6000);
    e.endTurn("north");
    expect(power()).toBe(7000);
  });
});

describe("EB05-021 Alvida", () => {
  test("On Play draws 2, plays a Cross Guild Character, then blocks Character plays this turn", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["EB05-021", "OP12-049"],
        deck: ["EB01-005", "OP01-012", "OP01-036"],
        activeDon: 10,
      },
      {},
    );
    e.playCard("EB05-021", "south");
    e.choose("effectPlaySelection", ["OP12-049"], "south");
    const view = e.getView("south");
    expect(ids(view.players.south.characters)).toEqual(
      expect.arrayContaining(["EB05-021", "OP12-049"]),
    );
    expect(ids(view.players.south.hand).sort(byText)).toEqual(["EB01-005", "OP01-012"]);
    expect(
      e.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: e.findCardInZone("south", "hand", "EB01-005"),
      }).reason,
    ).toBe("A card effect prevents this card from being played.");
  });

  test("When Attacking negates an opposing Character's effects this turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "EB05-021" }, playedOnTurn: 0 }] },
      { character: ["OP13-013"] },
    );
    const targetId = e.findCardInZone("north", "character", "OP13-013");
    e.attack("EB05-021", e.leader("north"), "south");
    e.choose("effectTargetSelection", [targetId], "south");
    const negations = Object.values(e.getState().modifiers).filter((modifier) =>
      JSON.stringify(modifier).includes("effectsNegated"),
    );
    expect(negations).toHaveLength(1);
    expect(JSON.stringify(negations[0])).toContain(targetId);
  });
});

describe("EB05-028 Boa Hancock", () => {
  test("On Play: an opponent with 9+ cards in hand trashes 4", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-028"], activeDon: 4 }, { hand: 9 });
    e.playCard("EB05-028", "south");
    const hand = e.getState().players.north.hand.slice(0, 4);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: hand }, "north");
    expect(e.getView("north").players.north.handCount).toBe(5);
    expect(e.getView("north").players.north.trash).toHaveLength(4);
  });

  test("On Play does nothing against 8 cards in hand", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-028"], activeDon: 4 }, { hand: 8 });
    e.playCard("EB05-028", "south");
    expect(e.getView("north").players.north.handCount).toBe(8);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});

describe("EB05-047 Ripley", () => {
  test("gains +12 cost and On Play may trash 1 to play a cost 2 or less Character from trash", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-047", "EB01-005"], trash: ["OP01-012", "EB01-018"], activeDon: 4 },
      {},
    );
    e.playCard("EB05-047", "south");
    e.accept("south");
    // The only hand card pays the trash cost; it is then a legal cost-1 trash target.
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Ripley's trash play.");
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId)).toEqual(
      expect.arrayContaining(["OP01-012", "EB01-005"]),
    );
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId)).not.toContain(
      "EB01-018",
    );
    e.choose("effectPlaySelection", ["OP01-012"], "south");
    const view = e.getView("south");
    expect(ids(view.players.south.characters)).toEqual(
      expect.arrayContaining(["EB05-047", "OP01-012"]),
    );
    const ripley = view.players.south.characters.find((c) => c?.cardId === "EB05-047");
    expect(ripley?.cost).toBe(16);
  });

  test("declining the optional trash keeps the hand and plays nothing from trash", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-047", "EB01-005"], trash: ["OP01-012"], activeDon: 4 },
      {},
    );
    e.playCard("EB05-047", "south");
    e.decline("south");
    const view = e.getView("south");
    expect(ids(view.players.south.hand)).toEqual(["EB01-005"]);
    expect(ids(view.players.south.trash)).toEqual(["OP01-012"]);
    expect(ids(view.players.south.characters).filter(Boolean)).toEqual(["EB05-047"]);
    expect(view.prompts).toHaveLength(0);
  });
});

describe("EB05-010 Nico Robin (Leader)", () => {
  test("once per turn, a K.O.'d Wisdom Character adds the top deck card to Life", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "EB05-010",
        character: [
          { card: { id: "EB02-029" }, rested: true },
          { card: { id: "EB02-034" }, rested: true },
        ],
        deck: 3,
      },
      { character: [{ card: { id: "EB01-018" }, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const life = e.getView("south").players.south.lifeCount;
    const ryu = e.findCardInZone("south", "character", "EB02-029");
    e.declareAttack(e.leader("north"), ryu, "north");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life + 1);

    const komei = e.findCardInZone("south", "character", "EB02-034");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), komei, "north");
    expect(e.hasPendingChoice("south")).toBe(false);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB02-034");
    expect(e.getView("south").players.south.lifeCount).toBe(life + 1);
  });

  test("Activate: Main sets a rested Wisdom Character with 6000 power or less as active", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "EB05-010",
        character: [
          { card: { id: "EB02-029" }, rested: true },
          { card: { id: "EB01-018" }, rested: true },
        ],
      },
      {},
    );
    e.activateMain("EB05-010", "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Robin's set-active target.");
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId)).toEqual(["EB02-029"]);
    e.choose("effectTargetSelection", ["EB02-029"], "south");
    const ryu = e.getView("south").players.south.characters.find((c) => c?.cardId === "EB02-029");
    expect(ryu?.rested).toBe(false);
  });
});

describe("EB05-012 Camie", () => {
  test("On Play rests an opposing Character with a cost of 6 or less", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-012"], activeDon: 3 },
      { character: ["EB01-018", "EB01-055"] },
    );
    e.playCard("EB05-012", "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Camie's rest target.");
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId)).toEqual(["EB01-018"]);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    const god = e.getView("south").players.north.characters.find((c) => c?.cardId === "EB01-018");
    expect(god?.rested).toBe(true);
  });
});

describe("EB05-016 Nico Robin", () => {
  test("Your Turn On Play plays a Wisdom Character with a cost of 5 or less from hand", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-016", "EB02-029", "EB01-018"], activeDon: 6 },
      {},
    );
    e.playCard("EB05-016", "south");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Robin's play selection.");
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId)).toEqual(["EB02-029"]);
    e.choose("effectPlaySelection", ["EB02-029"], "south");
    expect(ids(e.getView("south").players.south.characters)).toEqual(
      expect.arrayContaining(["EB05-016", "EB02-029"]),
    );
  });

  test("Trigger rests an opposing Character with a cost of 6 or less", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-016", "EB01-005"] },
      { character: ["EB01-018"] },
      { activeSeat: "north" },
    );
    hitSouthLeaderAndActivateTrigger(e);
    e.choose("effectTargetSelection", ["EB01-018"], "south");
    const god = e.getView("south").players.north.characters.find((c) => c?.cardId === "EB01-018");
    expect(god?.rested).toBe(true);
  });
});

describe("EB05-052 Gloriosa", () => {
  test("Trigger draws 2 then trashes 1 from hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-052", "EB01-005"], deck: ["OP01-012", "EB01-018", "OP01-036"], hand: [] },
      {},
      { activeSeat: "north" },
    );
    hitSouthLeaderAndActivateTrigger(e);
    const hand = e.getState().players.south.hand;
    expect(hand).toHaveLength(2);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [hand[0]!] }, "south");
    const view = e.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.deckCount).toBe(1);
    // The discarded card and the resolved Trigger card itself.
    expect(ids(view.players.south.trash).sort(byText)).toEqual(
      [e.getState().cards[hand[0]!]!.cardId, "EB05-052"].sort(byText),
    );
  });
});

describe("EB05-053 Charlotte Praline", () => {
  test("When Attacking against a 9+ card hand adds a hand card to the top of Life once per turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "EB05-053" }, playedOnTurn: 0 }], hand: ["EB01-005"] },
      { hand: 9 },
    );
    const life = e.getView("south").players.south.lifeCount;
    e.attack("EB05-053", e.leader("north"), "south");
    e.choose("effectTargetSelection", ["EB01-005"], "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life + 1);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
  });
});

describe("EB05-055 Nami", () => {
  test("Your Turn On Play with a Wisdom Leader adds the top deck card to Life", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB05-010", hand: ["EB05-055"], deck: 3, activeDon: 5 },
      {},
    );
    const life = e.getView("south").players.south.lifeCount;
    e.playCard("EB05-055", "south");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life + 1);
  });

  test("On Play does nothing with a non-Wisdom Leader", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB05-055"], deck: 3, activeDon: 5 }, {});
    e.playCard("EB05-055", "south");
    expect(e.getView("south").players.south.deckCount).toBe(3);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Trigger: trash 1 from hand to play this card with 2 or less Life", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-055", "EB01-005"], hand: ["OP01-012"] },
      {},
      { activeSeat: "north" },
    );
    hitSouthLeaderAndActivateTrigger(e);
    e.accept("south");
    const view = e.getView("south");
    expect(ids(view.players.south.characters)).toContain("EB05-055");
    expect(ids(view.players.south.trash)).toEqual(["OP01-012"]);
  });

  test("declining the Trigger cost keeps the hand and does not play Nami", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-055", "EB01-005"], hand: ["OP01-012"] },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    e.decline("south");
    const view = e.getView("south");
    expect(ids(view.players.south.characters)).not.toContain("EB05-055");
    expect(ids(view.players.south.hand)).toEqual(["OP01-012"]);
    expect(ids(view.players.south.trash)).toEqual(["EB05-055"]);
  });
});

describe("EB05-056 Nico Olvia", () => {
  test("On Play: trash a Trigger card with a Nico Robin Leader to draw 2", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "EB05-010",
        hand: ["EB05-056", "EB05-055", "EB01-005"],
        deck: 3,
        activeDon: 1,
      },
      {},
    );
    e.playCard("EB05-056", "south");
    e.accept("south");
    // EB05-055 is the only hand card with a [Trigger], so it alone pays the cost.
    const view = e.getView("south");
    expect(ids(view.players.south.trash)).toEqual(["EB05-055"]);
    expect(view.players.south.hand).toHaveLength(3);
    expect(view.players.south.deckCount).toBe(1);
  });

  test("Trigger plays this card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-056", "EB01-005"] },
      {},
      { activeSeat: "north" },
    );
    hitSouthLeaderAndActivateTrigger(e);
    expect(ids(e.getView("south").players.south.characters)).toContain("EB05-056");
  });

  test("declining the optional trash draws nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB05-010", hand: ["EB05-056", "EB05-055"], deck: 3, activeDon: 1 },
      {},
    );
    e.playCard("EB05-056", "south");
    e.decline("south");
    const view = e.getView("south");
    expect(ids(view.players.south.hand)).toEqual(["EB05-055"]);
    expect(view.players.south.deckCount).toBe(3);
    expect(view.players.south.trash).toEqual([]);
  });
});

describe("EB05-057 Nojiko", () => {
  test("Activate: Main gives 1 rested DON!! to a Special or Wisdom Leader or Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "EB05-010", character: ["EB05-057", "EB01-018"], restedDon: 2 },
      {},
    );
    e.activateMain("EB05-057", "south");
    e.chooseAmount(1, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Nojiko's DON!! target.");
    const targets = step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId);
    expect(targets.sort(byText)).toEqual(["EB05-010", "EB05-057"]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getState().cards[e.leader("south")]?.attachedDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });

  test("Trigger with 2 or less Life plays a 6000-power-or-less Trigger Character from hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["EB05-057", "EB01-005"], hand: ["EB05-055", "EB01-018"] },
      {},
      { activeSeat: "north" },
    );
    hitSouthLeaderAndActivateTrigger(e);
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Nojiko's play selection.");
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId)).toEqual(["EB05-055"]);
    e.choose("effectPlaySelection", ["EB05-055"], "south");
    expect(ids(e.getView("south").players.south.characters)).toContain("EB05-055");
  });
});
