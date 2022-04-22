import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";

type SatisfyPredicate<TProperty, TRoot> = (
  value: TProperty,
  root: TRoot
) => boolean | Promise<boolean>;

export class SatisfyRule<TRoot, TProperty> extends RuleChecker<
  TRoot,
  TProperty
> {
  constructor(
    readonly predicate: SatisfyPredicate<TProperty, TRoot>,
    readonly errorType = "notSatisfy"
  ) {
    super();
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, TProperty>
  ): Promise<Unconformity | undefined> {
    const { propertyValue } = context;
    const satisfied = await this.predicate(propertyValue, context.parent);

    if (!satisfied) {
      return Unconformity.fromContext(context, this.errorType);
    }

    return undefined;
  }
}

export function satisfy<TRoot, TProperty>(
  predicate: SatisfyPredicate<TProperty, TRoot>,
  errorType = "notSatisfy"
): RuleChecker<TRoot, TProperty> {
  return new SatisfyRule<TRoot, TProperty>(predicate, errorType);
}
