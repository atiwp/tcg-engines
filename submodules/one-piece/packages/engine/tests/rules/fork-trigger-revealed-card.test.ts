// OP Practice fork fix (user-approved 2026-11-23), see FORK-CHANGES.md: a Life [Trigger] prompt
// carries the revealed card's card id (`revealedCardId`) on its legal descriptor and decision.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";
import { getLegalCommands } from "../../src/core.ts";

type Engine = OnePieceTestEngine;

const pendingFor = (e: Engine, seat: "south" | "north") =>
  e.getState().promptQueue.find((p) => p.status === "pending" && p.seat === seat);

describe("revealed [Trigger] card id on the prompt (fork fix)", () => {
  test("a Life [Trigger] prompt carries the revealed card's id; the hidden Life card stays hidden", () => {
    // EB05-016 has a [Trigger]; OP17-045 (the next Life card) stays face-down.
    const e = OnePieceTestEngine.create(
      { life: ["EB05-016", "OP17-045"] },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    const prompt = pendingFor(e, "south");
    expect(prompt?.resolutionContext?.intent).toBe("lifeTrigger");
    const descriptor = getLegalCommands(e.getState(), "south").find(
      (d) => d.type === "resolvePrompt" && d.promptId === prompt!.id,
    );
    expect(descriptor?.revealedCardId).toBe("EB05-016");
    const decision = e.getView("south").decisions.find((d) => d.id === prompt!.id);
    expect(decision?.revealedCardId).toBe("EB05-016");
    // The other seat has no such decision; nobody sees the face-down Life card's code.
    expect(e.getView("north").decisions.some((d) => d.revealedCardId)).toBe(false);
    for (const seat of ["south", "north"] as const) {
      expect(JSON.stringify(e.getView(seat))).not.toContain("OP17-045");
      expect(JSON.stringify(getLegalCommands(e.getState(), seat))).not.toContain("OP17-045");
    }
  });

  test("other prompts carry no revealedCardId", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-047", "EB01-005"], trash: ["OP01-012"], activeDon: 4 },
      {},
    );
    e.playCard("EB05-047", "south");
    const prompt = pendingFor(e, "south");
    expect(prompt?.resolutionContext?.intent).toBe("effectOptional");
    const descriptor = getLegalCommands(e.getState(), "south").find(
      (d) => d.type === "resolvePrompt" && d.promptId === prompt!.id,
    );
    expect(descriptor).toBeDefined();
    expect(descriptor?.revealedCardId).toBeUndefined();
    expect(
      e.getView("south").decisions.find((d) => d.id === prompt!.id)?.revealedCardId,
    ).toBeUndefined();
  });
});
