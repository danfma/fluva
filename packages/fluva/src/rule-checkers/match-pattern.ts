import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Inconsistency } from "../inconsistency";
import { Maybe } from "../utils";

export class MatchPatternRule<TRoot> extends RuleChecker<TRoot, Maybe<string>> {
  constructor(readonly pattern: RegExp) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, string>
  ): Promise<Inconsistency | undefined> {
    const { propertyValue } = context;

    if (
      typeof propertyValue === "string" &&
      !this.pattern.test(propertyValue)
    ) {
      return Inconsistency.fromContext(context, "pattern");
    }

    return undefined;
  }
}

export function matchPattern<TRoot>(pattern: RegExp): MatchPatternRule<TRoot> {
  return new MatchPatternRule<TRoot>(pattern);
}
