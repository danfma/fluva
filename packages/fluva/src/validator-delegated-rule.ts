import { Rule } from "./rule";
import { Inconsistency } from "./inconsistency";
import { ValidationContext } from "./validation-context";
import { Validator } from "./validator";

export class ValidatorDelegatedRule<TRoot, TProperty> implements Rule<TRoot> {
  constructor(
    readonly property: string,
    readonly getter: (target: TRoot) => TProperty,
    readonly validator: Validator<TProperty>
  ) {}

  async verify(context: ValidationContext<TRoot>): Promise<Inconsistency[]> {
    const { parent } = context;
    const propertyValue = this.getter(parent);
    const result = await this.validator.validate(propertyValue);

    return result.inconsistencies.map((Inconsistency) =>
      Inconsistency.with({
        validatingPath: [this.property, ...Inconsistency.validatingPath],
      })
    );
  }

  toString(): string {
    const validatorName: string =
      Object.getPrototypeOf(this.validator).constructor?.name ??
      String(this.validator);

    return `ValidatorDelegatedRule(property=${this.property}, validator=${validatorName})`;
  }
}
