import { CascadeChecking } from "./cascade-checking"
import { PropertyValidationContext } from "./property-validation-context"
import { RuleChecker } from "./rule-checker"
import { Unconformity } from "./unconformity"
import { ValidationContext } from "./validation-context"

export class PropertyRule<TRoot, TProperty> {
  constructor(
    readonly property: string,
    readonly getter: (item: TRoot) => TProperty,
    readonly checkers: RuleChecker<TRoot, TProperty>[] = []) {

  }

  async verify(context: ValidationContext<TRoot>): Promise<Array<Unconformity>> {
    const { parent, cascade } = context
    const propertyValue = this.getter(parent)
    const unconformities: Unconformity[] = []

    for (const checker of this.checkers) {
      const propertyContext = new PropertyValidationContext(context, [this.property], this.property, propertyValue)
      const unconformity = await checker.check(propertyContext)

      if (!unconformity) {
        continue
      }

      unconformities.push(unconformity)

      if (cascade === CascadeChecking.StopOnFirstError) {
        break
      }
    }

    return unconformities
  }

  toString(): string {
    return `PropertyRule(property="${this.property}")`
  }
}
