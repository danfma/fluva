import { PropertyValidationContext } from "../property-validation-context"
import { Unconformity } from "../unconformity"
import { Maybe } from "../utils"
import { MinLengthRule } from "./min-length"

export type AcceptedType = Maybe<string>

export class NotEmptyRule<TRoot> extends MinLengthRule<TRoot> {
  constructor() {
    super(1)
  }

  async check(context: PropertyValidationContext<TRoot, AcceptedType>): Promise<Unconformity | null> {
    const unconformity = await super.check(context)

    return unconformity?.with({ errorType: 'notEmpty', message: 'validation.rule.notEmpty' }) ?? null
  }
}

export function notEmpty<TRoot>(): NotEmptyRule<TRoot> {
  return new NotEmptyRule<TRoot>()
}
