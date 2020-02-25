import { PropertyValidationContext } from "../property-validation-context"
import { RuleChecker } from "../rule-checker"
import { Unconformity } from "../unconformity"
import { isNullOrUndefined } from "../utils"

export class RequiredRule<TRoot> extends RuleChecker<TRoot, any> {
  async check(context: PropertyValidationContext<TRoot, any>): Promise<Unconformity | null> {
    const { propertyValue } = context

    if (isNullOrUndefined(propertyValue)) {
      return Unconformity.fromContext(context, 'required')
    }

    return null
  }
}

export function required<TRoot>(): RuleChecker<TRoot, any> {
  return new RequiredRule<TRoot>()
}
