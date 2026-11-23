// OP Practice fork fix (user-approved 2026-11-23), see FORK-CHANGES.md: commandFromDescriptor
// builds a playCard command for a full Character area (`slotChoices: []`), so a Character can be
// played there and the rule 3-7-6-1 prompt (trash one of your Characters) opens.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";
import { getLegalCommands } from "../../src/core.ts";
import { commandFromDescriptor } from "../../src/automation/bot-strategies.ts";
import { heuristicAgent } from "../../src/automation/heuristic-strategy.ts";

type Engine = OnePieceTestEngine;

const FULL = ["EB01-005", "OP01-012", "OP01-036", "OP01-010", "OP02-097"];
const chars = (e: Engine) => e.getView("south").players.south.characters.map((c) => c?.cardId);
const trash = (e: Engine) => e.getView("south").players.south.trash.map((c) => c.cardId);
const playDescriptor = (e: Engine) => {
  const found = getLegalCommands(e.getState(), "south").find(
    (d) => d.type === "playCard" && e.getState().cards[d.sourceId ?? ""]?.cardId === "EB01-018",
  );
  if (!found) throw new Error("Expected a legal play for EB01-018.");
  return found;
};

describe("playing a Character onto a full Character area (fork fix)", () => {
  test("the descriptor builds a command, and the replacement prompt trashes the chosen Character", () => {
    const e = OnePieceTestEngine.create({ hand: ["EB01-018"], character: FULL, activeDon: 5 }, {});
    const descriptor = playDescriptor(e);
    expect(descriptor.slotChoices).toEqual([]);
    const command = commandFromDescriptor(e.getState(), "south", descriptor);
    expect(command).toMatchObject({ type: "playCard", seat: "south" });
    expect(command && "slotIndex" in command ? command.slotIndex : undefined).toBeUndefined();
    e.exec(command!);
    const step = e.pendingDecision("playCharacterReplacement", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected the replacement choice.");
    expect(step.candidates.map((c) => e.getState().cards[c.ref.id]?.cardId).sort()).toEqual(
      [...FULL].sort(),
    );
    e.choose("playCharacterReplacement", ["EB01-005"], "south");
    expect(chars(e)).toContain("EB01-018");
    expect(chars(e)).not.toContain("EB01-005");
    expect(trash(e)).toEqual(["EB01-005"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("a normal play into a free slot is unchanged", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB01-018"], character: FULL.slice(0, 4), activeDon: 5 },
      {},
    );
    const descriptor = playDescriptor(e);
    expect(descriptor.slotChoices?.length).toBeGreaterThan(0);
    const command = commandFromDescriptor(e.getState(), "south", descriptor);
    expect(command).toMatchObject({ type: "playCard", slotIndex: descriptor.slotChoices![0] });
    e.exec(command!);
    expect(chars(e)).toContain("EB01-018");
    expect(trash(e)).toEqual([]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("the heuristic bot's prompt resolver answers the replacement prompt", () => {
    // Its move scoring still skips full-area plays (heuristic-strategy.ts, a policy choice left
    // as upstream wrote it); the play itself now builds, and the resolver handles 3-7-6-1.
    const e = OnePieceTestEngine.create({ hand: ["EB01-018"], character: FULL, activeDon: 5 }, {});
    e.exec(commandFromDescriptor(e.getState(), "south", playDescriptor(e))!);
    const prompt = e
      .getState()
      .promptQueue.find((p) => p.status === "pending" && p.seat === "south");
    expect(prompt?.resolutionContext?.intent).toBe("playCharacterReplacement");
    const answer = heuristicAgent.resolvePrompt!(e.getState(), prompt!, { random: () => 0 });
    expect(answer).not.toBeNull();
    e.exec(answer!);
    expect(chars(e)).toContain("EB01-018");
    expect(trash(e)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
