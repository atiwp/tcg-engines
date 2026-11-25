import type { EffectTrigger, Keyword, Zone } from "./primitives.ts";
import type { Target, TargetFilter } from "./target.ts";
import type { Condition } from "./condition.ts";
import type { Cost } from "./cost.ts";
import type { Action } from "./action.ts";

export interface EffectEventFilter {
  player?: "self" | "opponent" | "any";
  causedBy?: "self" | "opponent" | "any";
  koCause?: "battle" | "effect";
  fromZone?: Zone;
  toZone?: Zone;
  targetSelf?: boolean;
  sourceSelf?: boolean;
  /** Requires a completed power comparison, excluding battles aborted before the damage step. */
  battlePowerCompared?: boolean;
  filters?: TargetFilter[];
  sourceFilters?: TargetFilter[];
  targetFilters?: TargetFilter[];
  sourceFromZone?: Zone;
  minimumAmount?: number;
  /** Life count immediately after the triggering removal, not at effect resolution. */
  lifeCountAfterRemoval?: number;
  /** Disjunctive alternate filters for one printed multi-predicate trigger. */
  anyOf?: EffectEventFilter[];
}

export interface EffectBlock {
  trigger: EffectTrigger;
  source?: "opponentEffect" | "opponentCharacterEffect" | "effect";
  eventFilter?: EffectEventFilter;
  conditions?: Condition[];
  costs?: Cost[];
  /** Choose and pay one group, in addition to any common costs. */
  alternativeCosts?: Cost[][];
  /** Conditions evaluated after costs are paid, for printed "You may ...: If ..." effects. */
  postCostConditions?: Condition[];
  actions: Action[];
  optional?: boolean;
  oncePerTurn?: boolean;
  oncePerTurnKey?: string;
  /**
   * `whenDonReturned` only: whose returned DON!! card the block reacts to. Default "self" (the
   * printed "a DON!! card on your field is returned to your DON!! deck"); "any" also reacts to the
   * opponent's DON!! card returned to their DON!! deck, where an official ruling says so
   * (OP02-071 Magellan, qa_op02.pdf). OP Practice fork fix 9.
   */
  donOwner?: "self" | "any";
}

export interface PermanentEffect {
  conditions?: Condition[];
  // Added conditions combine by conjunction. Permanent added costs still need
  // a defined ordering contract with resolved cost grants.
  actions: Exclude<Action, { action: "addActivationCosts" }>[];
}

export interface ReplacementEffect {
  replacedEvent: "ko" | "removeFromField" | "loseGame" | "leaveField" | "rested";
  target?: Target;
  source?: "opponentEffect" | "opponentCharacterEffect" | "battle" | "effect";
  replacementAction: Action;
  eventFilter?: EffectEventFilter;
  conditions?: Condition[];
  oncePerTurn?: boolean;
  /** Shared identity for branches originating from one printed once-per-turn replacement ability. */
  oncePerTurnKey?: string;
  /** Mandatory printed replacement. Omitted replacement effects remain optional for compatibility. */
  mandatory?: true;
}

export type DeckBuildingRule =
  | { rule: "unlimitedCopies" }
  | { rule: "cannotInclude"; filters: TargetFilter[] }
  | { rule: "donDeckCount"; count: number };

export interface CardEffects {
  /** Before opening hands, optionally search for and play one matching Stage, then shuffle. */
  startOfGame?: { playStageFromDeck: { filters: TargetFilter[] } };
  keywords?: Keyword[];
  effects?: EffectBlock[];
  permanentEffects?: PermanentEffect[];
  replacementEffects?: ReplacementEffect[];
  deckBuildingRules?: DeckBuildingRule[];
}
