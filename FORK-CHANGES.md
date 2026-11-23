# Fork-only changes (atiwp/tcg-engines, branch `op-practice-local-cards`)

This fork serves the OP Practice app. Everything below differs from upstream
TheCardGoat/tcg-engines and is dropped once upstream has its own equivalent.

- **Local card definitions** (cards the pinned engine lacks) live in
  `submodules/one-piece/packages/cards/src/cards/local/` and are listed in
  `local/LOCAL-CARDS.md`, not here. Upstream definitions always win.
- **Engine bug fixes** are made only when the user approves each one. Each is listed below, marked
  in the code with `OP Practice fork fix (user-approved <date>)`, logged in OP Practice's
  `docs/engine-issues.md`, and reported upstream.

## Engine bug fixes

| Date | File | Change and reason | Tests | Upstream issue |
| --- | --- | --- | --- | --- |
| 2026-11-22 | `submodules/one-piece/packages/engine/src/effects/resolution.ts` (post-cost condition check) | A [Once Per Turn] ability whose cost was paid is marked used even when its post-cost "If" fails. Before, it returned before storing the once-per-turn key, so the ability could be activated and paid for again the same turn (seen on OP18-060 Saint Gunko; affects e.g. OP08-079 Kaido, ST13-003 Monkey.D.Luffy). Added in the commit "OP Practice fork fix: [Once Per Turn] used when the post-cost If fails" on `op-practice-local-cards`. | `submodules/one-piece/packages/engine/tests/rules/fork-once-per-turn-post-cost.test.ts` | Not filed yet (report pending) |
| 2026-11-22 | `submodules/one-piece/packages/engine/src/state.ts` (`resetStartOfTurnState`) | [Once Per Turn] means once in every turn: at the start of each turn the once-per-turn marks of both players' field cards are cleared. Before, only the turn player's cards were cleared, so an ability used in your own turn could not be used in the opponent's next turn (OP17-048 Shiki, OP17-040 Edward.Newgate). Added in the commit "OP Practice fork fix: [Once Per Turn] resets at the start of every turn" on `op-practice-local-cards`. | `submodules/one-piece/packages/engine/tests/rules/fork-once-per-turn-every-turn.test.ts` | Not filed yet (report pending) |
| 2026-11-23 | `submodules/one-piece/packages/engine/src/automation/bot-strategies.ts` (`commandFromDescriptor`, case `playCard`) | A legal `playCard` descriptor for a full Character area (`slotChoices: []`) returned `null`, so no bot or app could play a Character there. It now builds the command without `slotIndex`, which `applyCommand` accepts and answers with the rule 3-7-6-1 prompt (trash one of your Characters). The heuristic's own move scoring still skips such plays (unchanged). Added in the commit "OP Practice fork fix: play a Character onto a full Character area" on `op-practice-local-cards`. | `submodules/one-piece/packages/engine/tests/rules/fork-full-area-play.test.ts` | Not filed yet (report pending) |
