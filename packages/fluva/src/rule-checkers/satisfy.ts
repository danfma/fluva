import { PropertyValidationContext } from "../property-validation-context";
import { RuleChecker } from "../rule-checker";
import { Unconformity } from "../unconformity";

/**
 * The predicate function that will be used to check if the value is valid.
 * It can return a boolean or a Promise that resolves to a boolean.
 */
type SatisfyPredicate<TProperty, TRoot> = (
  value: TProperty,
  root: TRoot
) => boolean | Promise<boolean>;

/**
 * A RuleChecker that verifies that a property value satisfies a predicate.
 */
export class SatisfyRule<TRoot, TProperty> extends RuleChecker<
  TRoot,
  TProperty
> {
  constructor(
    readonly predicate: SatisfyPredicate<TProperty, TRoot>,
    readonly errorType = "satisfy"
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

/**
 * Creates a new RuleChecker that will verify that the value satisfies the given predicate.
 *
 * @param predicate the condition to be satisfied
 * @param errorType the type of the error when this condition fails (defaults to "satisfy")
 * @returns a rule checker that will verify that the value satisfies the given predicate
 */
export function satisfy<TRoot, TProperty>(
  predicate: SatisfyPredicate<TProperty, TRoot>,
  errorType = "satisfy"
): RuleChecker<TRoot, TProperty> {
  return new SatisfyRule<TRoot, TProperty>(predicate, errorType);
}
