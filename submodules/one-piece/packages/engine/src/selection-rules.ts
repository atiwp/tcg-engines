// OP Practice fork fix (user-approved 2026-11-23): expose the submit-time limits of effect
// multi-select prompts. Each branch mirrors a check in effects/resolution.ts (resolvePrompt):
// effectPlaySelection (differentNames, totalConstraint), effectTargetSelection (target
// totalConstraint), effectSimultaneousStateSelection (group target totalConstraint),
// effectGroupedPlaySelection (one card per group, selectionSatisfiesGroupedPlayAction).
// Validation itself is unchanged; this only reports it.
import { candidatesForPlayAction } from "./effects/actions.ts";
import type { MatchState, PromptState, SelectionRules } from "./types.ts";

export function selectionRulesForPrompt(
  state: MatchState,
  prompt: PromptState,
): SelectionRules | undefined {
  const context = prompt.resolutionContext;
  const rules: SelectionRules = {};
  if (context?.intent === "effectPlaySelection") {
    if (context.action.differentNames) rules.differentNames = true;
    if (context.action.totalConstraint) rules.totalConstraint = context.action.totalConstraint;
  } else if (context?.intent === "effectTargetSelection") {
    const action = context.action;
    const target = "target" in action ? action.target : null;
    if (target?.totalConstraint) rules.totalConstraint = target.totalConstraint;
  } else if (context?.intent === "effectSimultaneousStateSelection") {
    const group = context.process.groups[context.groupIndex];
    const constraint = group
      ? context.process.action.groups[group.index]?.target.totalConstraint
      : undefined;
    if (constraint) rules.totalConstraint = constraint;
  } else if (context?.intent === "effectGroupedPlaySelection") {
    const listed = new Set(context.candidateIds);
    rules.groups = context.action.groups.map((group) => ({
      candidateIds: (
        candidatesForPlayAction(state, context.controller, context.sourceInstanceId, {
          action: "play",
          source: context.action.source,
          count: group.count,
          filters: group.filters,
        }) ?? []
      ).filter((id) => listed.has(id)),
    }));
  }
  return Object.keys(rules).length > 0 ? rules : undefined;
}

// OP Practice fork fix (user-approved 2026-11-23): a Life [Trigger] prompt names the card that was
// revealed for its [Trigger]; that card is public, so its card id may go with the prompt.
export function revealedCardIdForPrompt(prompt: PromptState): string | undefined {
  return prompt.resolutionContext?.intent === "lifeTrigger" && prompt.sourceCardId
    ? prompt.sourceCardId
    : undefined;
}
