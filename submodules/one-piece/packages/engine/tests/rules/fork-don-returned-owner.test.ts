// OP Practice fork fix 9 (user-approved 2026-11-25), see FORK-CHANGES.md: per the official Q&A
// (qa_op02.pdf, OP02-071 Magellan: "Does 'When a DON!! card on your field is returned to your DON!!
// deck' include when my opponent's DON!! card is returned to my opponent's DON!! deck? Yes, it
// does."), Magellan's trigger also reacts to the opponent's DON!! card returned to their DON!! deck.
// No other "DON!! card returned" card has such a ruling, so they keep reacting to their own only.
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

type Engine = OnePieceTestEngine;
type Seat = "south" | "north";

const magellanPower = (e: Engine) => e.getView("south").players.south.leader?.power;
const pendingIntent = (e: Engine, seat: Seat) =>
  e.getState().promptQueue.find((p) => p.status === "pending" && p.seat === seat)?.resolutionContext
    ?.intent;

/** Answer the optional and ready-order prompts of `seat` with the first option. */
function settle(e: Engine, seat: Seat): void {
  for (let i = 0; i < 6; i++) {
    const intent = pendingIntent(e, seat);
    if (intent === "effectOptional") e.accept(seat);
    else if (intent === "readyEffectOrder") {
      const step = e.pendingDecision("readyEffectOrder", seat).steps[0];
      if (step?.kind !== "chooseOption") throw new Error("Expected an order choice.");
      e.resolveDecision("readyEffectOrder", { optionId: step.options[0]!.id }, seat);
    } else return;
  }
}
/** `seat` activates its ST05-010 Zephyr, which returns 1 of `seat`'s own DON!! cards. */
function zephyrReturnsOwnDon(e: Engine, seat: Seat): void {
  e.activateMain(e.findCardInZone(seat, "character", "ST05-010"), seat);
  settle(e, seat);
}
/** South plays OP16-074: with an {Impel Down} Leader, North returns 1 DON!! card. */
function opponentReturnsDon(e: Engine): void {
  e.playCard("OP16-074", "south");
  settle(e, "south");
}
/** Ids of sources whose effect was queued after event index `since`. */
const queuedSources = (e: Engine, since: number) =>
  e
    .getState()
    .eventHistory.slice(since)
    .filter((event) => event.type === "resolutionQueued")
    .map((event) => event.sourceInstanceId);

describe("OP02-071 Magellan reacts to either player's DON!! returned (fork fix 9)", () => {
  test("the opponent's DON!! returned to their DON!! deck gives +1000 in our turn", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", hand: ["OP16-074"], activeDon: 10 },
      { activeDon: 5 },
    );
    expect(magellanPower(e)).toBe(5000);
    opponentReturnsDon(e);
    expect(e.getView("south").players.north.activeDon).toBe(4);
    expect(magellanPower(e)).toBe(6000);
  });

  test("our own DON!! returned still gives +1000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", character: ["ST05-010"], activeDon: 10 },
      { activeDon: 5 },
    );
    zephyrReturnsOwnDon(e, "south");
    expect(magellanPower(e)).toBe(6000);
  });

  test("Once Per Turn: our DON!! then the opponent's (and the reverse) give +1000 once", () => {
    const ours = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", character: ["ST05-010"], hand: ["OP16-074"], activeDon: 10 },
      { activeDon: 5 },
    );
    zephyrReturnsOwnDon(ours, "south");
    opponentReturnsDon(ours);
    expect(magellanPower(ours)).toBe(6000);
    const theirs = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071", character: ["ST05-010"], hand: ["OP16-074"], activeDon: 10 },
      { activeDon: 5 },
    );
    opponentReturnsDon(theirs);
    zephyrReturnsOwnDon(theirs, "south");
    expect(magellanPower(theirs)).toBe(6000);
  });

  test("[Your Turn]: the opponent returning their DON!! in their turn gives nothing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-071" },
      { character: ["ST05-010"], activeDon: 5 },
      { activeSeat: "north" },
    );
    zephyrReturnsOwnDon(e, "north");
    expect(e.getView("south").players.north.activeDon).toBe(4);
    expect(magellanPower(e)).toBe(5000);
  });
});

// Every other card with a "When a DON!! card on your field is returned" trigger. Their Q&As
// (qa_st-10.pdf ST10-007 / -011 / -014, qa_op06.pdf OP06-042) only rule that our own DON!! returned
// by the opponent's effect counts; none says the opponent's DON!! counts.
const OTHER_CHARACTERS = [
  "EB02-035",
  "EB03-033",
  "EB04-035",
  "OP05-074",
  "OP06-076",
  "OP08-067",
  "OP09-074",
  "OP11-077",
  "OP12-072",
  "OP14-068",
  "OP17-062",
  "P-077",
  "ST10-007",
  "ST10-011",
  "ST10-014",
  "ST34-001",
];
const OTHER_LEADERS = ["OP04-058", "OP06-042", "OP09-061"];

describe("other DON!!-returned cards still react only to their own DON!! (fork fix 9)", () => {
  for (const id of [...OTHER_CHARACTERS, ...OTHER_LEADERS]) {
    const asLeader = OTHER_LEADERS.includes(id);
    const southSide = (extra: string[]) =>
      asLeader
        ? { leaderCardId: id, character: extra, activeDon: 10 }
        : { character: [id, ...extra], activeDon: 10 };
    const subject = (e: Engine) =>
      asLeader ? e.leader("south") : e.findCardInZone("south", "character", id);

    test(`${id}: queued for our own DON!! returned, not for the opponent's`, () => {
      const own = OnePieceTestEngine.create(southSide(["ST05-010"]), { activeDon: 5 });
      const ownSince = own.getState().eventHistory.length;
      zephyrReturnsOwnDon(own, "south");
      expect(queuedSources(own, ownSince)).toContain(subject(own));

      const theirs = OnePieceTestEngine.create(
        southSide([]),
        { character: ["ST05-010"], activeDon: 5 },
        { activeSeat: "north" },
      );
      const since = theirs.getState().eventHistory.length;
      zephyrReturnsOwnDon(theirs, "north");
      expect(theirs.getView("south").players.north.activeDon).toBe(4);
      expect(queuedSources(theirs, since)).not.toContain(subject(theirs));
    });
  }
});
