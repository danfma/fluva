import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";

type Getter<TRoot, TProperty> = (parent: TRoot) => TProperty;
type ValueOrGetter<TRoot, TProperty> = Getter<TRoot, TProperty> | TProperty;

function isGetter<TRoot, TProperty>(
  valueOrGetter: ValueOrGetter<TRoot, TProperty>
): valueOrGetter is Getter<TRoot, TProperty> {
  return typeof valueOrGetter === "function";
}

export class EqualToRule<TRoot, TProperty> extends RuleChecker<
  TRoot,
  TProperty
> {
  constructor(readonly valueOrGetter: ValueOrGetter<TRoot, TProperty>) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, TProperty>
  ): Promise<Unconformity | undefined> {
    const { propertyValue, parent } = context;
    const expectedValue = this.getExpectedValue(parent);

    if (propertyValue !== expectedValue) {
      return Unconformity.fromContext(context, "equalTo", {
        expected: expectedValue,
      });
    }

    return undefined;
  }

  private getExpectedValue(parent: TRoot): TProperty {
    const valueOrGetter = this.valueOrGetter;

    return isGetter(valueOrGetter) ? valueOrGetter(parent) : valueOrGetter;
  }
}

export function equalTo<TRoot, TProperty>(
  value: ValueOrGetter<TRoot, TProperty>
): EqualToRule<TRoot, TProperty> {
  return new EqualToRule(value);
}
