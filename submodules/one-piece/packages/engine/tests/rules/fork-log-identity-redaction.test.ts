// OP Practice fork fix (user-approved 2026-11-23), see FORK-CHANGES.md: the player view's logs
// carry a card's ids only for a viewer who could see that card when the entry was logged (or whose
// message names it), so hidden cards (face-down Life, deck, the other player's hand) do not leak.
import { getCard } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

type Engine = OnePieceTestEngine;
type Seat = "south" | "north";

/** Every place a hidden card could show up in a seat's projected logs. */
function leaks(e: Engine, seat: Seat, instanceId: string): string[] {
  const cardId = e.getState().cards[instanceId]!.cardId;
  const name = getCard(cardId).name;
  return e
    .getView(seat)
    .logs.filter(
      (log) =>
        log.sourceInstanceId === instanceId ||
        log.targetIds.includes(instanceId) ||
        log.sourceCardId === cardId ||
        log.message.includes(name),
    )
    .map((log) => log.message);
}

describe("log identities in the player view (fork fix)", () => {
  test("EB05-055 Nami: the deck card added face-down to Life does not reach either view's logs", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "EB05-010",
        hand: ["EB05-055"],
        deck: ["EB01-018", "EB01-005"],
        activeDon: 5,
      },
      {},
    );
    const hidden = e.findCardInZone("south", "deck", "EB01-018");
    e.playCard("EB05-055", "south");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getState().players.south.life[0]).toBe(hidden);
    expect(leaks(e, "north", hidden)).toEqual([]);
    expect(leaks(e, "south", hidden)).toEqual([]);
  });

  test("EB05-053 Charlotte Praline: a hand card added face-down to Life does not reach the opponent", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: { id: "EB05-053" }, playedOnTurn: 0 }], hand: ["ST07-006"] },
      { hand: 9 },
    );
    const hidden = e.findCardInZone("south", "hand", "ST07-006");
    e.attack("EB05-053", e.leader("north"), "south");
    e.choose("effectTargetSelection", [hidden], "south");
    expect(e.getState().cards[hidden]?.zone).toBe("life");
    expect(leaks(e, "north", hidden)).toEqual([]);
  });

  test("OP03-102 Sanji: Life to hand stays the owner's; the deck card to Life reaches no one", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: { id: "OP03-102" }, playedOnTurn: 0, attachedDon: 2 }],
        life: ["OP01-012", "EB01-005"],
        deck: ["EB01-018", "OP01-036"],
      },
      {},
    );
    const lifeTop = e.getState().players.south.life[0]!;
    const deckTop = e.findCardInZone("south", "deck", "EB01-018");
    e.attack("OP03-102", e.leader("north"), "south");
    e.accept("south");
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getState().cards[lifeTop]?.zone).toBe("hand");
    expect(e.getState().cards[deckTop]?.zone).toBe("life");
    expect(leaks(e, "north", lifeTop)).toEqual([]);
    // The owner may see the Life card now in their hand.
    expect(e.getView("south").logs.some((log) => log.sourceInstanceId === lifeTop)).toBe(true);
    expect(leaks(e, "north", deckTop)).toEqual([]);
    expect(leaks(e, "south", deckTop)).toEqual([]);
  });

  test("public moves keep their ids for both seats", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB01-018"], activeDon: 5 },
      { character: [{ card: { id: "EB01-055" }, playedOnTurn: 0 }] },
    );
    const played = e.findCardInZone("south", "hand", "EB01-018");
    e.playCard("EB01-018", "south");
    for (const seat of ["south", "north"] as const) {
      expect(e.getView(seat).logs.some((log) => log.sourceInstanceId === played)).toBe(true);
    }
    e.endTurn("south");
    const attacker = e.findCardInZone("north", "character", "EB01-055");
    e.declareAttack(attacker, e.leader("south"), "north");
    for (const seat of ["south", "north"] as const) {
      expect(e.getView(seat).logs.some((log) => log.sourceInstanceId === attacker)).toBe(true);
    }
  });
});
