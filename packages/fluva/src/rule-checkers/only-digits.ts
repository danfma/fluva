import { PropertyValidationContext } from "../property-validation-context";
import { Inconsistency } from "../inconsistency";
import { MatchPatternRule } from "./match-pattern";

export class OnlyDigitsRule<TRoot> extends MatchPatternRule<TRoot> {
  static readonly pattern = /^[0-9]*$/;

  constructor() {
    super(OnlyDigitsRule.pattern);
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, string>
  ): Promise<Inconsistency | undefined> {
    const inconsistency = await super.checkValue(context);

    return (
      inconsistency?.with({
        errorType: "onlyDigits",
        message: "validation.rule.onlyDigits",
      }) ?? undefined
    );
  }
}

export function onlyDigits<TRoot>(): OnlyDigitsRule<TRoot> {
  return new OnlyDigitsRule<TRoot>();
}
