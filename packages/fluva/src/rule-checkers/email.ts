import { PropertyValidationContext } from "../property-validation-context";
import { Inconsistency } from "../inconsistency";
import { MatchPatternRule } from "./match-pattern";

export class EmailRule<TRoot> extends MatchPatternRule<TRoot> {
  static readonly pattern =
    /^([a-zA-Z][a-zA-Z0-9._-]*)@([a-zA-Z][a-zA-Z0-9_-]*(\.[a-zA-Z][a-zA-Z0-9_-]*){0,2})$/;

  constructor() {
    super(EmailRule.pattern);
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, string>
  ): Promise<Inconsistency | undefined> {
    const Inconsistency = await super.checkValue(context);

    return (
      Inconsistency?.with({
        errorType: "email",
        message: "validation.rule.email",
      }) ?? undefined
    );
  }
}

export function email<TRoot>(): EmailRule<TRoot> {
  return new EmailRule<TRoot>();
}
