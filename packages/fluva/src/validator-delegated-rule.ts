import { Rule } from "./rule"
import { Unconformity } from "./unconformity"
import { ValidationContext } from "./validation-context"
import { Validator } from "./validator"

export class ValidatorDelegatedRule<TRoot, TProperty> implements Rule<TRoot> {

  constructor(
    readonly property: string,
    readonly getter: (target: TRoot) => TProperty,
    readonly validator: Validator<TProperty>) {

  }

  async verify(context: ValidationContext<TRoot>): Promise<Unconformity[]> {
    const { parent } = context
    const propertyValue = this.getter(parent)
    const result = await this.validator.validate(propertyValue)

    return result.unconformities.map(
      unconformity => unconformity.with({
        validatingPath: [this.property, ...unconformity.validatingPath]
      })
    )
  }

  toString(): string {
    return `ValidatorDelegatedRule(property=${this.property}, validator=${this.validator})`
  }

}
