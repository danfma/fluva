import { AbstractValidator } from "./abstract-validator";
import { Unconformity } from "./unconformity";
import { flatten } from "./utils";
import { ValidationContext } from "./validation-context";
import { ValidationResult } from "./validation-result";
import { Validator } from "./validator";

export class ForEachValidator<T> extends AbstractValidator<T[]> {
  constructor(readonly validator: Validator<T>) {
    super();
  }

  protected async validateContext(
    _onlyProperties: string[],
    validationContext: ValidationContext<T[]>
  ): Promise<ValidationResult> {
    const { parent: items } = validationContext;

    const unconformities = await Promise.all(
      items.map(async (item, index) => await this.validateItem(item, index))
    );

    return new ValidationResult(flatten(unconformities));
  }

  private async validateItem(item: T, index: number): Promise<Unconformity[]> {
    const result = await this.validator.validate(item);

    return result.unconformities.map((unconformity) =>
      unconformity.with({
        validatingPath: [`${index}`, ...unconformity.validatingPath],
      })
    );
  }
}

export function forEach<T>(validator: Validator<T>): Validator<T[]> {
  return new ForEachValidator(validator);
}
