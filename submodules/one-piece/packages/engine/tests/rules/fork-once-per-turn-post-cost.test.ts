// OP Practice fork fix (user-approved 2026-11-22), see FORK-CHANGES.md: a [Once Per Turn]
// ability whose cost was paid is used for the turn even when its post-cost "If" fails.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

type Engine = OnePieceTestEngine;

const activate = (e: Engine, sourceInstanceId: string) =>
  e.exec({ type: "activateEffect", seat: "south", sourceInstanceId, trigger: "activateMain" });
const refused = (e: Engine, sourceInstanceId: string) =>
  e.expectFailure({
    type: "activateEffect",
    seat: "south",
    sourceInstanceId,
    trigger: "activateMain",
  }).accepted;
const handIds = (e: Engine) => e.getState().players.south.hand;

/** Ends South's turn and North's, so it is South's next turn. */
function nextSouthTurn(e: Engine): void {
  e.endTurn("south");
  e.endTurn("north");
}

describe("[Once Per Turn] with a post-cost condition (fork fix)", () => {
  test("OP18-060 Saint Gunko: the If fails, the trash is paid, and the ability is used this turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP18-060",
        hand: ["EB01-005", "OP01-012"],
        character: ["OP18-088"],
        deck: 5,
      },
      {},
    );
    const leader = e.leader("south");
    const donDeck = e.getView("south").players.south.donDeckCount;
    activate(e, leader);
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    // No 8000+ base power Character (OP18-088 is 6000): no DON!! is added.
    expect(e.getView("south").players.south.donDeckCount).toBe(donDeck);
    expect(handIds(e)).toHaveLength(1);
    expect(refused(e, leader)).toBe(false);
    expect(handIds(e)).toHaveLength(1);

    nextSouthTurn(e);
    activate(e, leader);
    expect(e.hasPendingChoice("south")).toBe(true);
  });

  test("OP18-060 Saint Gunko: the success path is unchanged and also once per turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP18-060",
        hand: ["EB01-005", "OP01-012"],
        character: ["OP18-119"],
        deck: 5,
      },
      {},
    );
    const leader = e.leader("south");
    const before = e.getView("south").players.south;
    activate(e, leader);
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    if (e.hasPendingChoice("south")) e.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const after = e.getView("south").players.south;
    expect(after.activeDon).toBe(before.activeDon + 1);
    expect(after.donDeckCount).toBe(before.donDeckCount - 1);
    expect(refused(e, leader)).toBe(false);
  });

  test("OP08-079 Kaido (upstream): not played this turn, the trash is paid and the ability is used", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP08-079" }, playedOnTurn: 0 }],
        hand: ["EB01-005", "OP01-012"],
        deck: 5,
      },
      { character: ["EB01-018"], hand: 2 },
    );
    const kaido = e.findCardInZone("south", "character", "OP08-079");
    activate(e, kaido);
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    // "If this Character was played on this turn" fails: nothing happens to the opponent.
    expect(e.getView("south").players.north.characters.map((c) => c?.cardId)).toContain("EB01-018");
    expect(e.getView("south").players.north.handCount).toBe(2);
    expect(handIds(e)).toHaveLength(1);
    expect(refused(e, kaido)).toBe(false);

    nextSouthTurn(e);
    activate(e, kaido);
    expect(e.hasPendingChoice("south")).toBe(true);
  });
});
