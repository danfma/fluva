import { PropertyValidationContext } from "../property-validation-context"
import { Unconformity } from "../unconformity"
import { MatchPatternRule } from "./match-pattern"

export class IsEmailRule<TRoot> extends MatchPatternRule<TRoot> {
  static readonly pattern = /^([a-zA-Z][a-zA-Z0-9._-]*)@([a-zA-Z][a-zA-Z0-9_-]*(\.[a-zA-Z][a-zA-Z0-9_-]*){0,2})$/;

  constructor() {
    super(IsEmailRule.pattern)
  }

  async check(context: PropertyValidationContext<TRoot, string>): Promise<Unconformity | null> {
    const unconformity = await super.check(context)

    return unconformity?.with({ errorType: 'email', message: 'validation.rule.email' }) ?? null
  }
}

export function isEmail<TRoot>(): IsEmailRule<TRoot> {
  return new IsEmailRule<TRoot>()
}
