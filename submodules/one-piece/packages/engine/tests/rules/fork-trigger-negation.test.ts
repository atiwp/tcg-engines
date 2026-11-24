// OP Practice fork fix 8 (user-approved 2026-11-24), see FORK-CHANGES.md: per the official Q&A
// (qa_op17.pdf, OP17-112 / OP17-105) a Character whose effects are negated is no longer treated as
// having a [Trigger]. The `hasTrigger` filter now checks negation for cards in play only.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

type Engine = OnePieceTestEngine;
const daifukuPower = (e: Engine) =>
  e.getView("south").players.south.characters.find((c) => c?.cardId === "OP17-107")?.power;
const pending = (e: Engine, seat: "south" | "north", intent: string) =>
  e
    .getState()
    .promptQueue.some(
      (p) => p.status === "pending" && p.seat === seat && p.resolutionContext?.intent === intent,
    );

function attackWithDaifuku(e: Engine): void {
  e.declareAttack(e.findCardInZone("south", "character", "OP17-107"), e.leader("north"), "south");
}

describe("a negated [Trigger] Character no longer has a [Trigger] (fork fix 8)", () => {
  test("OP17-112 Linlin's 8000 base stops when OP09-097 negates our OP17-107: 4000 - 4000 = 0", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-112", { card: { id: "OP17-107" }, playedOnTurn: 0 }] },
      { hand: ["OP09-097"], activeDon: 2 },
    );
    expect(daifukuPower(e)).toBe(8000);
    attackWithDaifuku(e);
    if (pending(e, "north", "battleBlocker")) {
      e.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    }
    const vortex = e.findCardInZone("north", "hand", "OP09-097");
    e.resolveDecision("battleCounter", { selectedIds: [vortex] }, "north");
    if (pending(e, "north", "effectTargetSelection")) {
      e.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [e.findCardInZone("south", "character", "OP17-107")] },
        "north",
      );
    }
    expect(daifukuPower(e)).toBe(0);
  });

  test("without the negation our [Trigger] Character keeps the 8000 base", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-112", { card: { id: "OP17-107" }, playedOnTurn: 0 }] },
      {},
    );
    expect(daifukuPower(e)).toBe(8000);
    attackWithDaifuku(e);
    expect(daifukuPower(e)).toBe(8000);
  });

  test("a [Trigger] card in hand still counts (OP03-115's cost: trash a card with a [Trigger])", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP03-115", "OP17-107"], activeDon: 5 },
      { character: [{ card: { id: "OP01-012" } }] },
    );
    e.playCard("OP03-115", "south");
    e.accept("south");
    const trash = e.getView("south").players.south.trash.map((c) => c?.cardId);
    expect(trash).toContain("OP17-107");
  });
});
