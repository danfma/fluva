import { PropertyValidationContext } from "../property-validation-context"
import { RuleChecker } from "../rule-checker"
import { Unconformity } from "../unconformity"
import { isStringOrArray, Maybe } from "../utils"

export type AcceptedType = Maybe<string | Array<any>>

export class MaxLengthRule<TRoot> extends RuleChecker<TRoot, AcceptedType> {
  constructor(readonly maxLength: number) {
    super()
  }

  async check(context: PropertyValidationContext<TRoot, AcceptedType>): Promise<Unconformity | null> {
    const { propertyValue } = context

    if (isStringOrArray(propertyValue) && propertyValue.length > this.maxLength) {
      return Unconformity.fromContext(context, 'maxLength', {
        maxLength: this.maxLength
      })
    }

    return null
  }
}

export function maxLength<TRoot>(length: number): MaxLengthRule<TRoot> {
  return new MaxLengthRule<TRoot>(length)
}
