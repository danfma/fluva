import { AbstractValidator } from "../abstract-validator";
import { Inconsistency } from "../inconsistency";
import { flatten } from "../utils";
import { ValidationContext } from "../validation-context";
import { Validator } from "../validator";

export class ForEachValidator<T> extends AbstractValidator<T[]> {
  constructor(readonly validator: Validator<T>) {
    super();
  }

  protected async getInconsistencies(
    validationContext: ValidationContext<T[]>
  ): Promise<Inconsistency[]> {
    const { parent: items } = validationContext;

    const inconsistencies = await Promise.all(
      items.map((item, index) => this.getInconsistenciesOfItem(item, index))
    );

    return flatten(inconsistencies);
  }

  private async getInconsistenciesOfItem(
    item: T,
    index: number
  ): Promise<Inconsistency[]> {
    const result = await this.validator.validate(item);

    return result.inconsistencies.map((Inconsistency) =>
      Inconsistency.with({
        validatingPath: [`${index}`, ...Inconsistency.validatingPath],
      })
    );
  }
}

export function forEach<T>(validator: Validator<T>): Validator<T[]> {
  return new ForEachValidator(validator);
}
