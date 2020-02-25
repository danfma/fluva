import { PropertyValidationContext } from "../property-validation-context"
import { RuleChecker } from "../rule-checker"
import { Unconformity } from "../unconformity"
import { isStringOrArray, Maybe } from "../utils"

export type AcceptedType = Maybe<string | Array<any>>

export class MinLengthRule<TRoot> extends RuleChecker<TRoot, AcceptedType> {
  constructor(readonly minLength: number) {
    super()
  }

  async check(context: PropertyValidationContext<TRoot, AcceptedType>): Promise<Unconformity | null> {
    const { propertyValue } = context

    if (isStringOrArray(propertyValue) && propertyValue.length < this.minLength) {
      return Unconformity.fromContext(context, "minLength", {
        minLength: this.minLength
      })
    }

    return null
  }
}

export function minLength<TRoot>(length: number): MinLengthRule<TRoot> {
  return new MinLengthRule<TRoot>(length)
}
