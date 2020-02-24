import { CascadeChecking } from "./cascade-checking"
import { Rule } from "./rule"
import { RuleBuilder } from "./rule-builder"
import { RuleChecker } from "./rule-checker"
import { flatten } from "./utils"
import { ValidationContext } from "./validation-context"
import { ValidationError } from "./validation-error"
import { ValidationResult } from "./validation-result"
import { Validator } from "./validator"

export abstract class AbstractValidator<TRoot> implements Validator<TRoot> {
  static defaultCascade = CascadeChecking.StopOnFirstError;
  private readonly rules: Rule<TRoot, any>[] = [];

  protected ruleFor<TKey extends keyof TRoot>(
    property: TKey
  ): RuleBuilder<TRoot, TRoot[TKey]>

  protected ruleFor<TProperty>(
    property: keyof TRoot,
    selector: (target: TRoot) => TProperty
  ): RuleBuilder<TRoot, TProperty>

  protected ruleFor(
    property: keyof TRoot,
    selector?: (target: TRoot) => any
  ): RuleBuilder<TRoot, any> {
    return {
      verify: (...checkers: RuleChecker<TRoot, any>[]) => {
        const defaultGetter = (root: TRoot): TRoot[typeof property] => root[property]

        this.rules.push(new Rule(property as string, selector ?? defaultGetter, checkers))
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async shouldValidate(context: ValidationContext<TRoot>, propertyNames: string[]): Promise<boolean> {
    return true
  }

  async validate(
    targetOrValidationContext: TRoot | ValidationContext<TRoot>,
    onlyProperties: string[] = [],
    cascade = AbstractValidator.defaultCascade
  ): Promise<ValidationResult> {

    const validationContext =
      targetOrValidationContext instanceof ValidationContext
        ? targetOrValidationContext
        : new ValidationContext(targetOrValidationContext, cascade)

    if (!await this.shouldValidate(validationContext, onlyProperties)) {
      return ValidationResult.empty
    }

    const propertiesToVerify =
      onlyProperties.length ? onlyProperties : this.rules.map(x => x.property)

    const isRelevantRule =
      (rule: Rule<TRoot, any>): boolean => propertiesToVerify.indexOf(rule.property) >= 0

    const relevantRules = this.rules.filter(isRelevantRule)
    const unconformities = await Promise.all(relevantRules.map(rule => rule.verify(validationContext)))

    return new ValidationResult(flatten(unconformities))
  }

  async validateOrThrow(instance: TRoot, properties: string[] = []): Promise<void> {
    const result = await this.validate(instance, properties)

    if (result.invalid) {
      throw new ValidationError(result, properties)
    }
  }
}
