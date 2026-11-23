// OP Practice fork fix (user-approved 2026-11-23), see FORK-CHANGES.md: effect multi-select
// prompts expose their submit-time limits (`selectionRules`) on the legal descriptor and the
// player view. Validation is unchanged: selections that break the limits are still refused.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";
import { getLegalCommands } from "../../src/core.ts";

type Engine = OnePieceTestEngine;

const pendingPrompt = (e: Engine) => {
  const prompt = e.getState().promptQueue.find((p) => p.status === "pending" && p.seat === "south");
  if (!prompt) throw new Error("Expected a pending prompt for south.");
  return prompt;
};
const descriptorFor = (e: Engine, promptId: string) =>
  getLegalCommands(e.getState(), "south").find(
    (d) => d.type === "resolvePrompt" && d.promptId === promptId,
  );
const decisionFor = (e: Engine, promptId: string) =>
  e.getView("south").decisions.find((d) => d.id === promptId);
const resolve = (promptId: string, selectedIds: string[]) =>
  ({ type: "resolvePrompt", seat: "south", promptId, selectedIds }) as const;

describe("effect multi-select limits are exposed (fork fix)", () => {
  test("OP17-118 Rocks.D.Xebec: different names and total cost 9 or less", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["OP17-118", "OP17-045", "OP17-045", "OP17-040", "OP17-048"],
        deck: 3,
        activeDon: 10,
      },
      {},
    );
    const [lowA, lowB] = e
      .getState()
      .players.south.hand.filter((id) => e.getState().cards[id]!.cardId === "OP17-045");
    const newgate = e.findCardInZone("south", "hand", "OP17-040");
    const shiki = e.findCardInZone("south", "hand", "OP17-048");
    e.playCard("OP17-118", "south");
    const prompt = pendingPrompt(e);
    expect(prompt.resolutionContext?.intent).toBe("effectPlaySelection");
    const rules = {
      differentNames: true,
      totalConstraint: { property: "cost", comparison: "lte", value: 9 },
    };
    expect(descriptorFor(e, prompt.id)?.selectionRules).toEqual(rules);
    expect(decisionFor(e, prompt.id)?.selectionRules).toEqual(rules);

    // Same card name: refused. Different names but total cost 13: refused.
    expect(e.expectFailure(resolve(prompt.id, [lowA!, lowB!])).accepted).toBe(false);
    expect(e.expectFailure(resolve(prompt.id, [newgate, shiki])).accepted).toBe(false);
    // Different names, total cost 8: accepted.
    e.exec(resolve(prompt.id, [lowA!, newgate]));
    const chars = e.getView("south").players.south.characters.map((c) => c?.cardId);
    expect(chars).toEqual(expect.arrayContaining(["OP17-118", "OP17-045", "OP17-040"]));
  });

  test("OP17-119 Loki: total cost 4 or less", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-119"], activeDon: 6 },
      { character: ["EB01-005", "OP01-012", "EB02-029"] },
    );
    const c1 = e.findCardInZone("north", "character", "EB01-005");
    const c2 = e.findCardInZone("north", "character", "OP01-012");
    const c3 = e.findCardInZone("north", "character", "EB02-029");
    e.playCard("OP17-119", "south");
    const prompt = pendingPrompt(e);
    expect(prompt.resolutionContext?.intent).toBe("effectTargetSelection");
    const rules = { totalConstraint: { property: "cost", comparison: "lte", value: 4 } };
    expect(descriptorFor(e, prompt.id)?.selectionRules).toEqual(rules);
    expect(decisionFor(e, prompt.id)?.selectionRules).toEqual(rules);

    expect(e.expectFailure(resolve(prompt.id, [c2, c3])).accepted).toBe(false);
    e.exec(resolve(prompt.id, [c1, c3]));
    const trash = e.getView("south").players.north.trash.map((c) => c.cardId);
    expect(trash.sort((a, b) => String(a).localeCompare(String(b)))).toEqual(["EB01-005", "EB02-029"]);
  });

  test("OP06-086 grouped play: one card per group, from that group's candidates", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP06-086"], trash: ["EB02-034", "OP01-012", "EB02-029"], activeDon: 8 },
      {},
    );
    const four = e.findCardInZone("south", "trash", "EB02-034");
    const two = e.findCardInZone("south", "trash", "OP01-012");
    const three = e.findCardInZone("south", "trash", "EB02-029");
    e.playCard("OP06-086", "south");
    const prompt = pendingPrompt(e);
    expect(prompt.resolutionContext?.intent).toBe("effectGroupedPlaySelection");
    const groups = descriptorFor(e, prompt.id)?.selectionRules?.groups;
    expect(groups?.map((g) => [...g.candidateIds].sort())).toEqual([
      [four, two, three].sort(),
      [two],
    ]);
    expect(decisionFor(e, prompt.id)?.selectionRules?.groups).toEqual(groups);

    // Cost 4 and cost 3 both only fit the first group: refused. Cost 4 and cost 2: accepted.
    expect(e.expectFailure(resolve(prompt.id, [four, three])).accepted).toBe(false);
    e.exec(resolve(prompt.id, [four, two]));
    // "Play 1 card and play the other card rested": choose which one is active.
    const states = pendingPrompt(e);
    e.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: states.id,
      optionId: states.options[0]!.id,
    });
    const chars = e.getView("south").players.south.characters.map((c) => c?.cardId);
    expect(chars).toEqual(expect.arrayContaining(["OP06-086", "EB02-034", "OP01-012"]));
  });

  test("a selection prompt without such limits carries no selectionRules", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB05-012"], activeDon: 3 },
      { character: ["EB01-018"] },
    );
    e.playCard("EB05-012", "south");
    const prompt = pendingPrompt(e);
    expect(descriptorFor(e, prompt.id)).toBeDefined();
    expect(descriptorFor(e, prompt.id)?.selectionRules).toBeUndefined();
    expect(decisionFor(e, prompt.id)?.selectionRules).toBeUndefined();
  });
});
