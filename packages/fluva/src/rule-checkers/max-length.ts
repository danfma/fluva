import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";
import { isStringOrArray, Maybe } from "../utils";

export type AcceptedType = Maybe<string | unknown[]>;

export class MaxLengthRule<TRoot> extends RuleChecker<TRoot, AcceptedType> {
  constructor(readonly maxLength: number) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, AcceptedType>
  ): Promise<Unconformity | undefined> {
    const { propertyValue } = context;

    if (
      isStringOrArray(propertyValue) &&
      propertyValue.length > this.maxLength
    ) {
      return Unconformity.fromContext(context, "maxLength", {
        maxLength: this.maxLength,
      });
    }

    return undefined;
  }
}

export function maxLength<TRoot>(length: number): MaxLengthRule<TRoot> {
  return new MaxLengthRule<TRoot>(length);
}
