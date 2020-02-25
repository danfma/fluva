import { AbstractValidator } from "../abstract-validator"
import { RuleBuilder } from "../rule-builder"
import { RuleChecker } from "../rule-checker"
import { Validator } from "../validator"

interface SetRuleProperty<T> {
  <TKey extends keyof T>(property: TKey): RuleBuilder<T, TKey>
  <TProperty>(property: keyof T, selector: (target: T) => TProperty): RuleBuilder<T, TProperty>
}

export type ValidatorConfiguration<T> =
  (setRuleProperty: SetRuleProperty<T>) => void

export function verify<T, TKey extends keyof T = keyof T>(
  property: TKey,
  ...checkers: RuleChecker<T, TKey>[]
): ValidatorConfiguration<T> {
  return (setRuleProperty) => setRuleProperty(property).verify(...checkers)
}

export function createValidator<T>(configurations: ValidatorConfiguration<T>[]): Validator<T> {
  return new class extends AbstractValidator<T> {
    constructor() {
      super()

      const setRuleProperty = this.ruleFor.bind(this)

      for (const configuration of configurations) {
        configuration(setRuleProperty)
      }
    }
  }
}
