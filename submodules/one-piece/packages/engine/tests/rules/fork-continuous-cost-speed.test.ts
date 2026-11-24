// OP Practice fork fix 7 (speed only, user-approved 2026-11-24), see FORK-CHANGES.md: the
// continuous cost/power fingerprint is built faster, with byte-identical results. These tests pin
// whole seeded games (final state, logs and commands) to hashes recorded with the pre-fix engine,
// and compare the fingerprint with a verbatim copy of the pre-fix function, on frozen states and
// inside Immer drafts.
import { createHash } from "node:crypto";
import { appendFileSync } from "node:fs";
import { produce } from "immer";
import { describe, expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import "../../src/index.ts";
import { runBotMatch } from "../../src/automation/bot-harness.ts";
import { greedyStrategy, randomStrategy } from "../../src/automation/bot-strategies.ts";
import { continuousCostFingerprint } from "../../src/engine/continuous-cost.ts";
import type { MatchConfig, MatchState } from "../../src/types.ts";

const DECKS: Record<string, string> = {
  sabo: "2xEB04-007 4xEB05-047 2xOP04-016 1xOP13-004 2xOP14-096 4xOP17-080 2xOP17-081 4xOP17-082 2xOP17-083 2xOP17-084 4xOP17-086 3xOP17-087 3xOP17-089 3xOP17-093 4xOP17-095 2xOP17-098 4xOP17-119 3xST01-011",
  gunko:
    "1xOP07-076 2xOP15-077 4xOP15-078 1xOP18-060 4xOP18-064 2xOP18-065 4xOP18-083 4xOP18-084 4xOP18-085 4xOP18-088 5xOP18-093 4xOP18-095 4xOP18-096 4xOP18-097 4xOP18-119",
  rocks:
    "1xEB05-028 3xOP08-051 1xOP17-039 4xOP17-040 2xOP17-042 2xOP17-044 4xOP17-045 4xOP17-046 4xOP17-048 4xOP17-049 2xOP17-050 4xOP17-052 4xOP17-054 4xOP17-055 4xOP17-056 4xOP17-118",
};

function deck(name: string): { leaderCardId: string; mainDeck: string[] } {
  let leaderCardId = "";
  const mainDeck: string[] = [];
  for (const entry of DECKS[name]!.split(" ")) {
    const [count, id] = entry.split("x") as [string, string];
    if (getCard(id).cardType === "leader") leaderCardId = id;
    else for (let i = 0; i < Number(count); i++) mainDeck.push(id);
  }
  return { leaderCardId, mainDeck };
}

function config(south: string, north: string, seed: string): MatchConfig {
  return {
    firstPlayer: "south",
    seed,
    shuffleDecks: true,
    openingHandSize: 5,
    skipFirstTurnDraw: true,
    maxCharacterSlots: 5,
    players: {
      south: { ...deck(south), playerName: "South" },
      north: { ...deck(north), playerName: "North" },
    },
  };
}

// The Sabo games take minutes in total; they run with RUN_OP_FORK_FIX7_GAMES=1 (like
// RUN_OP_BOT_BATCHES). The Gunko-Rocks game and the fingerprint check always run.
const GAMES = [
  { south: "sabo", north: "sabo", seed: "fix7-a", strategy: "greedy", slow: true },
  { south: "sabo", north: "sabo", seed: "fix7-b", strategy: "random", slow: true },
  { south: "sabo", north: "gunko", seed: "fix7-c", strategy: "random", slow: true },
  { south: "rocks", north: "sabo", seed: "fix7-d", strategy: "random", slow: true },
  { south: "gunko", north: "rocks", seed: "fix7-e", strategy: "greedy", slow: false },
] as const;
const slowGames = process.env.RUN_OP_FORK_FIX7_GAMES === "1";
const MAX_COMMANDS = 120;

/** Hashes recorded with the pre-fix engine (fork pin c1e9535). */
const PRE_FIX: Record<string, string> = {
  "fix7-a": "6b0738cafa857c18218cfe81b3b584644dfbb5cbf2eaf640c5264d59e705de2e",
  "fix7-b": "11143324964ce7aeef617528044998d5f583eb2686bf75d212e37b2068c417d7",
  "fix7-c": "966238cd3c457aa3ca5840355e6282efa39dff810c3b7f5e0620a7baca536a0a",
  "fix7-d": "47c5235115cc60ee256aeae43beb3313d459e7d9333a3abda7053ecadb874c21",
  "fix7-e": "a587d2cce7c017fb2e0e175310e70e375954abaaf77e91ce8fb56c0190cfced8",
};

const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

/** Verbatim copy of the pre-fix `continuousCostFingerprint`, without its frozen-state cache. */
function referenceFingerprint(state: MatchState): string {
  const inputs = JSON.stringify({
    cards: state.cards,
    players: state.players,
    modifiers: state.modifiers,
    activeSeat: state.activeSeat,
    turnNumber: state.turnNumber,
    phase: state.phase,
    battle: state.battle,
    koHistory: state.eventHistory.filter((event) => event.type === "characterKod"),
  });
  return (
    inputs +
    JSON.stringify(
      [
        ...new Set(
          Object.values(state.cards)
            .filter((card) => ["leader", "character", "stage", "hand"].includes(card.zone))
            .map((card) => card.cardId),
        ),
      ].map((id) => [id, getCard(id).effects?.permanentEffects]),
    )
  );
}

describe("fork fix 7: continuous cost fingerprint speed-up changes nothing", () => {
  for (const game of GAMES) {
    const label = `${game.south} vs ${game.north}, ${game.strategy}, seed ${game.seed}`;
    (game.slow && !slowGames ? test.skip : test)(
      `${label}: final state, logs and commands match the pre-fix engine`,
      () => {
        const strategy = game.strategy === "greedy" ? greedyStrategy : randomStrategy;
        const result = runBotMatch(
          config(game.south, game.north, game.seed),
          { south: strategy, north: strategy },
          { maxCommands: MAX_COMMANDS, seed: game.seed },
        );
        const hash = sha([result.finalState, result.logHistory, result.commandHistory]);
        if (process.env.FIX7_RECORD)
          appendFileSync(process.env.FIX7_RECORD, `${game.seed} ${hash}\n`);
        expect(result.totalCommands).toBeGreaterThan(20);
        expect(hash).toBe(PRE_FIX[game.seed]);
      },
      600_000,
    );
  }

  test("the fingerprint equals the pre-fix function on frozen states and inside drafts", () => {
    const result = runBotMatch(
      config("sabo", "gunko", "fix7-f"),
      { south: randomStrategy, north: randomStrategy },
      { maxCommands: 30, seed: "fix7-f" },
    );
    const state = result.finalState;
    expect(Object.isFrozen(state)).toBe(true);
    expect(continuousCostFingerprint(state)).toBe(referenceFingerprint(state));
    let checked = 0;
    produce(state, (draft) => {
      expect(continuousCostFingerprint(draft)).toBe(referenceFingerprint(draft));
      // Mutate cards, players, modifiers and history inside the draft, then compare again.
      const [first, second] = Object.values(draft.cards);
      first!.zone = first!.zone === "hand" ? "trash" : "hand";
      second!.rested = !second!.rested;
      draft.players.south.activeDon += 1;
      draft.turnNumber += 1;
      draft.modifiers["fix7-test"] = { id: "fix7-test" } as never;
      draft.eventHistory.push({ type: "characterKod", data: { fix7: true } } as never);
      expect(continuousCostFingerprint(draft)).toBe(referenceFingerprint(draft));
      delete draft.modifiers["fix7-test"];
      (second as { extra?: unknown }).extra = undefined;
      expect(continuousCostFingerprint(draft)).toBe(referenceFingerprint(draft));
      checked = 3;
    });
    expect(checked).toBe(3);
  }, 120_000);
});
