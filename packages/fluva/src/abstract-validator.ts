import { CascadeChecking } from "./cascade-checking";
import { Rule } from "./rule";
import { RuleBuilder } from "./rule-builder";
import { Inconsistency } from "./inconsistency";
import { flatten } from "./utils";
import { ValidationContext } from "./validation-context";
import { ValidationError } from "./validation-error";
import { ValidationResult } from "./validation-result";
import { Validator } from "./validator";
import { ValidatorRuleBuilder } from "./validator-rule-builder";

export abstract class AbstractValidator<TRoot> implements Validator<TRoot> {
  static defaultCascade = CascadeChecking.StopOnFirstError;
  private readonly rules: Rule<TRoot>[] = [];
  private readonly otherValidators: Validator<TRoot>[] = [];

  protected ruleFor<TKey extends keyof TRoot>(
    property: TKey
  ): RuleBuilder<TRoot, TRoot[TKey]>;
  protected ruleFor<TProperty>(
    property: keyof TRoot,
    selector: (target: TRoot) => TProperty
  ): RuleBuilder<TRoot, TProperty>;

  protected ruleFor(
    property: keyof TRoot,
    selector?: (target: TRoot) => unknown
  ): RuleBuilder<TRoot, unknown> {
    const defaultGetter = (root: TRoot): TRoot[typeof property] =>
      root[property];

    return new ValidatorRuleBuilder(
      property,
      selector ?? defaultGetter,
      this.rules
    );
  }

  /**
   * Adds another validator to be applied together with this, during the validation phase.
   * All found inconsistencies from all validators will be merged into the result.
   *
   * @param validator another validator that can validate the same type as this validator
   * @returns this validator
   */
  use(validator: Validator<TRoot>): this {
    this.otherValidators.push(validator);
    return this;
  }

  /**
   * Determines if this validation should be applied or not.
   *
   * @param context The validation context
   * @param propertyNames The properties that should be validated
   * @returns A promise that resolves to true if the validation should be performed, false otherwise
   */
  async shouldValidate(
    context: ValidationContext<TRoot>,
    propertyNames: string[]
  ): Promise<boolean> {
    return true;
  }

  async validate(
    targetOrValidationContext: TRoot | ValidationContext<TRoot>,
    onlyProperties: string[] = [],
    cascade = AbstractValidator.defaultCascade
  ): Promise<ValidationResult> {
    const validationContext = this.getValidationContext(
      targetOrValidationContext,
      cascade,
      onlyProperties
    );

    const enforceValidation = await this.shouldValidate(
      validationContext,
      onlyProperties
    );

    if (!enforceValidation) {
      return ValidationResult.empty;
    }

    const inconsistencies = flatten([
      await this.getInconsistencies(validationContext),
      await this.getInconsistenciesFromOtherValidators(validationContext),
    ]);

    return new ValidationResult(inconsistencies);
  }

  private getValidationContext(
    targetOrValidationContext: TRoot | ValidationContext<TRoot>,
    cascade: CascadeChecking,
    propertiesToValidate: string[]
  ): ValidationContext<TRoot> {
    return targetOrValidationContext instanceof ValidationContext
      ? targetOrValidationContext
      : new ValidationContext(
          targetOrValidationContext,
          cascade,
          propertiesToValidate
        );
  }

  protected async getInconsistencies(
    validationContext: ValidationContext<TRoot>
  ): Promise<Inconsistency[]> {
    const propertiesToVerify = validationContext.getPropertiesToVerify(
      this.rules
    );

    const isRelevantRule = (rule: Rule<TRoot>): boolean =>
      propertiesToVerify.includes(rule.property);

    const relevantRules = this.rules.filter(isRelevantRule);

    const inconsistencies = await Promise.all(
      relevantRules.map((rule) => rule.verify(validationContext))
    );

    return flatten(inconsistencies);
  }

  protected async getInconsistenciesFromOtherValidators(
    validationContext: ValidationContext<TRoot>
  ): Promise<Inconsistency[]> {
    const inconsistencies: Inconsistency[] = [];

    for (const validator of this.otherValidators) {
      const result = await validator.validate(validationContext);

      inconsistencies.push(...result.inconsistencies);
    }

    return inconsistencies;
  }

  async validateOrThrow(
    instance: TRoot,
    properties: string[] = []
  ): Promise<void> {
    const result = await this.validate(instance, properties);

    if (result.hasInconsistencies) {
      throw new ValidationError(result, properties);
    }
  }
}
