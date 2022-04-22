import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";
import { isStringOrArray, Maybe } from "../utils";

export type AcceptedType = Maybe<string | unknown[]>;

export class MinLengthRule<TRoot> extends RuleChecker<TRoot, AcceptedType> {
  constructor(readonly minLength: number) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, AcceptedType>
  ): Promise<Unconformity | undefined> {
    const { propertyValue } = context;

    if (
      isStringOrArray(propertyValue) &&
      propertyValue.length < this.minLength
    ) {
      return Unconformity.fromContext(context, "minLength", {
        minLength: this.minLength,
      });
    }

    return undefined;
  }
}

export function minLength<TRoot>(length: number): MinLengthRule<TRoot> {
  return new MinLengthRule<TRoot>(length);
}
