import { PropertyValidationContext } from "../property-validation-context"
import { RuleChecker } from "../rule-checker"
import { Unconformity } from "../unconformity"
import { Maybe } from "../utils"

export class MatchPatternRule<TRoot> extends RuleChecker<TRoot, Maybe<string>> {
  constructor(readonly pattern: RegExp) {
    super()
  }

  async check(context: PropertyValidationContext<TRoot, string>): Promise<Unconformity | null> {
    const { propertyValue } = context

    if (typeof propertyValue === 'string' && !this.pattern.test(propertyValue)) {
      return Unconformity.fromContext(context, 'pattern')
    }

    return null
  }
}

export function matchPattern<TRoot>(pattern: RegExp): MatchPatternRule<TRoot> {
  return new MatchPatternRule<TRoot>(pattern)
}
