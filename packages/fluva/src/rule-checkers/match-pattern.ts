import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";
import { Maybe } from "../utils";

export class MatchPatternRule<TRoot> extends RuleChecker<TRoot, Maybe<string>> {
  constructor(readonly pattern: RegExp) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, string>
  ): Promise<Unconformity | undefined> {
    const { propertyValue } = context;

    if (
      typeof propertyValue === "string" &&
      !this.pattern.test(propertyValue)
    ) {
      return Unconformity.fromContext(context, "pattern");
    }

    return undefined;
  }
}

export function matchPattern<TRoot>(pattern: RegExp): MatchPatternRule<TRoot> {
  return new MatchPatternRule<TRoot>(pattern);
}
