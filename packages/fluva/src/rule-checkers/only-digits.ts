import { PropertyValidationContext } from "../property-validation-context"
import { Unconformity } from "../unconformity"
import { MatchPatternRule } from "./match-pattern"

export class OnlyDigitsRule<TRoot> extends MatchPatternRule<TRoot> {
  static readonly pattern = /^[0-9]*$/;

  constructor() {
    super(OnlyDigitsRule.pattern)
  }

  async check(context: PropertyValidationContext<TRoot, string>): Promise<Unconformity | null> {
    const unconformity = await super.check(context)

    return unconformity?.with({ errorType: 'onlyDigits', message: 'validation.rule.onlyDigits' }) ?? null
  }
}

export function onlyDigits<TRoot>(): OnlyDigitsRule<TRoot> {
  return new OnlyDigitsRule<TRoot>()
}
