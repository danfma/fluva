import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";
import { isNullOrUndefined } from "../utils";

export class RequiredRule<TRoot> extends RuleChecker<TRoot, unknown> {
  protected async checkValue(
    context: PropertyValidationContext<TRoot, unknown>
  ): Promise<Unconformity | undefined> {
    const { propertyValue } = context;

    if (isNullOrUndefined(propertyValue)) {
      return Unconformity.fromContext(context, "required");
    }

    return undefined;
  }

  async check(
    context: PropertyValidationContext<TRoot, unknown>
  ): Promise<Unconformity | undefined> {
    return this.checkValue(context);
  }
}

export function required<TRoot>(): RuleChecker<TRoot, unknown> {
  return new RequiredRule<TRoot>();
}
