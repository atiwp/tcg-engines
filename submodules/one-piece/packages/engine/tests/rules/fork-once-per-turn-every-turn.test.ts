// OP Practice fork fix (user-approved 2026-11-22), see FORK-CHANGES.md: [Once Per Turn] means
// once in every turn, so an ability used in your own turn can be used again in the opponent's turn.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

type Engine = OnePieceTestEngine;
type Seat = "south" | "north";

const pending = (e: Engine, seat: Seat) =>
  e.getState().promptQueue.filter((p) => p.status === "pending" && p.seat === seat);

/**
 * Resolve `seat`'s pending prompts: order effects as offered, accept only `acceptSource`'s
 * optional ability (decline any other), pay a trash cost with the first offered card, and pick
 * `target` for a target selection. Returns how many times `acceptSource`'s optional was offered.
 */
function drive(e: Engine, seat: Seat, acceptSource: string, target?: string): number {
  let offered = 0;
  for (let guard = 0; guard < 12; guard += 1) {
    const prompt = pending(e, seat)[0];
    if (!prompt) break;
    const intent = prompt.resolutionContext?.intent;
    const step = e.getView(seat).decisions.find((d) => d.id === prompt.id)?.steps[0];
    if (intent === "readyEffectOrder" && step?.kind === "chooseOption") {
      e.resolveDecision(intent, { optionId: step.options[0]!.id }, seat);
    } else if (intent === "effectOptional") {
      const mine = prompt.resolutionContext?.sourceInstanceId === acceptSource;
      if (mine) offered += 1;
      e.resolveDecision(intent, { optionId: mine ? "yes" : "no" }, seat);
    } else if (intent === "effectCostTrashFromHand" && step?.kind === "payCost") {
      e.resolveDecision(intent, { selectedIds: [step.candidates[0]!.ref.id] }, seat);
    } else if (intent === "effectTargetSelection" && target) {
      e.resolveDecision(intent, { selectedIds: [target] }, seat);
    } else if (intent === "battleCounter") {
      e.resolveDecision(intent, { selectedIds: [] }, seat);
    } else {
      break;
    }
  }
  return offered;
}

/** Rocks Pirates cards South has trashed to pay the abilities' costs. */
const paid = (e: Engine) =>
  e.getState().players.south.trash.filter((id) => e.getState().cards[id]?.cardId === "OP17-045")
    .length;

describe("[Once Per Turn] is once in every turn (fork fix)", () => {
  test("OP17-048 Shiki: used on its own attack, it can respond in the opponent's next turn, once", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP17-048" }, playedOnTurn: 0 }],
        hand: ["OP17-045", "OP17-045", "OP17-045"],
      },
      {
        character: [
          { card: { id: "EB01-018" }, playedOnTurn: 0 },
          { card: { id: "EB01-055" }, playedOnTurn: 0 },
        ],
      },
    );
    const shiki = e.findCardInZone("south", "character", "OP17-048");
    const god = e.findCardInZone("north", "character", "EB01-018");
    e.declareAttack(shiki, e.leader("north"), "south");
    expect(drive(e, "south", shiki, god)).toBe(1);
    drive(e, "north", "none");
    expect(paid(e)).toBe(1);

    e.endTurn("south");
    e.declareAttack(god, e.leader("south"), "north");
    expect(drive(e, "south", shiki, god)).toBe(1);
    expect(paid(e)).toBe(2);
    // Still once within this turn: the second attack does not offer it again.
    e.declareAttack(e.findCardInZone("north", "character", "EB01-055"), e.leader("south"), "north");
    expect(drive(e, "south", shiki, god)).toBe(0);
    expect(paid(e)).toBe(2);
  });

  test("OP17-040 Edward.Newgate: used when the Leader attacks, it works again when the Leader is attacked", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: ["OP17-040"],
        hand: ["OP17-045", "OP17-045", "OP17-045"],
      },
      {
        character: [
          { card: { id: "EB01-018" }, playedOnTurn: 0 },
          { card: { id: "EB01-055" }, playedOnTurn: 0 },
        ],
      },
    );
    const newgate = e.findCardInZone("south", "character", "OP17-040");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    expect(drive(e, "south", newgate)).toBe(1);
    drive(e, "north", "none");
    expect(paid(e)).toBe(1);

    e.endTurn("south");
    e.declareAttack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"), "north");
    expect(drive(e, "south", newgate)).toBe(1);
    expect(paid(e)).toBe(2);
    e.declareAttack(e.findCardInZone("north", "character", "EB01-055"), e.leader("south"), "north");
    expect(drive(e, "south", newgate)).toBe(0);
    expect(paid(e)).toBe(2);
  });

  test("the post-cost fix still holds: OP18-060's failed If uses the ability for this turn only", () => {
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
    const activate = {
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: leader,
      trigger: "activateMain",
    } as const;
    e.exec(activate);
    e.accept("south");
    e.choose("effectCostTrashFromHand", ["EB01-005"], "south");
    expect(e.expectFailure(activate).accepted).toBe(false);
    e.endTurn("south");
    e.endTurn("north");
    e.exec(activate);
    expect(e.hasPendingChoice("south")).toBe(true);
  });
});
