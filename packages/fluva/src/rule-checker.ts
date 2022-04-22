import { PropertyValidationContext } from "./property-validation-context";
import { Severity } from "./severity";
import { Unconformity } from "./unconformity";
import { isNullOrUndefined } from "./utils";

export abstract class RuleChecker<TRoot, TProperty> {
  protected abstract checkValue(
    context: PropertyValidationContext<TRoot, TProperty>
  ): Promise<Unconformity | undefined>;

  /**
   * Check the value of the property contained in the specified validation context.
   *
   * @param context the context of the validation.
   * @returns
   */
  async check(
    context: PropertyValidationContext<TRoot, TProperty>
  ): Promise<Unconformity | undefined> {
    const { propertyValue } = context;

    return !isNullOrUndefined(propertyValue)
      ? await this.checkValue(context)
      : undefined;
  }

  withCustomMessage(message: string): RuleChecker<TRoot, TProperty> {
    const sourceChecker = this;

    return new (class extends RuleChecker<TRoot, TProperty> {
      async checkValue(
        context: PropertyValidationContext<TRoot, TProperty>
      ): Promise<Unconformity | undefined> {
        const unconformity = await sourceChecker.check(context);

        return unconformity?.with({ message }) ?? undefined;
      }
    })();
  }

  withSeverity(severity: Severity): RuleChecker<TRoot, TProperty> {
    const sourceChecker = this;

    return new (class extends RuleChecker<TRoot, TProperty> {
      async checkValue(
        context: PropertyValidationContext<TRoot, TProperty>
      ): Promise<Unconformity | undefined> {
        const unconformity = await sourceChecker.check(context);

        return unconformity?.with({ severity }) ?? undefined;
      }
    })();
  }
}
