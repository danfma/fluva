import { PropertyValidationContext } from "./property-validation-context"
import { Severity } from "./severity"
import { Unconformity } from "./unconformity"

export abstract class RuleChecker<TRoot, TProperty> {
  abstract check(context: PropertyValidationContext<TRoot, TProperty>): Promise<Unconformity | null>

  withCustomMessage(message: string): RuleChecker<TRoot, TProperty> {
    // eslint-disable-next-line no-use-before-define
    return new RuleCheckerWithUnconformityOverrides(this, { message })
  }

  withSeverity(severity: Severity): RuleChecker<TRoot, TProperty> {
    // eslint-disable-next-line no-use-before-define
    return new RuleCheckerWithUnconformityOverrides(this, { severity })
  }
}

class RuleCheckerWithUnconformityOverrides<TRoot, TProperty> extends RuleChecker<TRoot, TProperty> {
  constructor(
    readonly delegatedChecker: RuleChecker<TRoot, TProperty>,
    readonly unconformityOverrides: Partial<Unconformity>
  ) {
    super()
  }

  async check(context: PropertyValidationContext<TRoot, TProperty>): Promise<Unconformity | null> {
    const unconformity = await this.delegatedChecker.check(context)

    return unconformity?.with(this.unconformityOverrides) ?? null
  }
}
