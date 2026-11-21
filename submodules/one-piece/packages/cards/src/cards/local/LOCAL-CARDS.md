# OP Practice local cards (fork-only)

Card definitions the pinned engine lacks, added for the OP Practice app in the fork
`atiwp/tcg-engines` only. They are not meant for upstream as-is.

- **Source:** optcgapi.com card data (name, type, colour, cost, power, counter, life, attribute,
  types, effect text), saved 2026-11-21. Effect text is copied verbatim (including the printed
  typo "If your have" on EB05-057). optcgapi's `(NNN)` name suffix is dropped, as upstream does.
  Types are optcgapi's space-joined `sub_types`, split on the engine's existing type names.
  `imageUrl` follows optcgapi's `Card_Images/<id>.jpg` pattern and is unverified (OP Practice
  never loads it).
- **Effects:** written only with the existing effect DSL, copying the encoding of upstream cards
  with the same wording. No engine rules code was changed.
- **Upstream wins:** `src/index.ts` adds a local card only when no upstream definition has its id
  (`addLocalCards`); `localCardIdsDefinedUpstream` lists local ids upstream now defines. Delete
  those files when updating the engine.
- **Tests:** `packages/cards/tests/local-cards.test.ts` (registration, upstream wins) and
  `packages/engine/src/cards/local/eb05-local-cards.test.ts` (each card played through the engine).

| Card     | Name                | Supported                                                                                                                                                                                        | Not supported                                                                                                                       |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| EB05-001 | Jewelry Bonney      | All: [On Play] Supernovas-Leader draw 2 + play up to 2 ≤2000-power Characters; [Activate: Main] [Once Per Turn] -1000 to a 6000+ Leader/Character until the end of the opponent's next End Phase | —                                                                                                                                   |
| EB05-010 | Nico Robin (Leader) | [Once Per Turn] a K.O.'d "Wisdom" Character adds the top deck card to Life; [Activate: Main] [Once Per Turn] set a ≤6000-power "Wisdom" Character active                                         | "and without [Blocker]": the DSL has no negated keyword filter, so a K.O.'d Wisdom Character **with** [Blocker] also triggers it    |
| EB05-012 | Camie               | All: [On Play] rest an opposing cost ≤6 Character                                                                                                                                                | —                                                                                                                                   |
| EB05-016 | Nico Robin          | All: [Your Turn] [On Play] play a cost ≤5 "Wisdom" Character from hand; [Trigger] rest an opposing cost ≤6 Character                                                                             | —                                                                                                                                   |
| EB05-021 | Alvida              | All: [On Play] draw 2, play a cost ≤8 {Cross Guild} Character, then no Character plays this turn; [When Attacking] negate an opposing Character this turn                                        | —                                                                                                                                   |
| EB05-028 | Boa Hancock         | All: [On Play] opponent with 9+ cards in hand trashes 4                                                                                                                                          | —                                                                                                                                   |
| EB05-047 | Ripley              | All: +12 cost; [On Play] trash 1: play a cost ≤2 Character from trash                                                                                                                            | —                                                                                                                                   |
| EB05-052 | Gloriosa            | [Trigger] draw 2, trash 1                                                                                                                                                                        | "If you would take damage, you may trash this Character instead.": the DSL has no damage replacement event; the clause does nothing |
| EB05-053 | Charlotte Praline   | All: [When Attacking] [Once Per Turn] opponent with 9+ cards: add a hand card to the top of Life                                                                                                 | —                                                                                                                                   |
| EB05-055 | Nami                | All: [Your Turn] [On Play] Wisdom-Leader deck-to-Life; [Trigger] trash 1: with ≤2 Life play this card                                                                                            | —                                                                                                                                   |
| EB05-056 | Nico Olvia          | All: [On Play] trash a [Trigger] card: with a [Nico Robin] Leader draw 2; [Trigger] play this card                                                                                               | —                                                                                                                                   |
| EB05-057 | Nojiko              | All: [Activate: Main] [Once Per Turn] give 1 rested DON!! to a "Special"/"Wisdom" Leader or Character; [Trigger] with ≤2 Life play a ≤6000-power [Trigger] Character from hand                   | —                                                                                                                                   |
