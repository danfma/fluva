import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Inconsistency } from "../inconsistency";
import { isStringOrArray, Maybe } from "../utils";

export type AcceptedType = Maybe<string | unknown[]>;

export class MinLengthRule<TRoot> extends RuleChecker<TRoot, AcceptedType> {
  constructor(readonly minLength: number) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, AcceptedType>
  ): Promise<Inconsistency | undefined> {
    const { propertyValue } = context;

    if (
      isStringOrArray(propertyValue) &&
      propertyValue.length < this.minLength
    ) {
      return Inconsistency.fromContext(context, "minLength", {
        minLength: this.minLength,
      });
    }

    return undefined;
  }
}

export function minLength<TRoot>(length: number): MinLengthRule<TRoot> {
  return new MinLengthRule<TRoot>(length);
}
