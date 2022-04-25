import { CascadeChecking } from "./cascade-checking";
import { PropertyValidationContext } from "./property-validation-context";
import { RuleChecker } from "./rule-checker";
import { Inconsistency } from "./inconsistency";
import { ValidationContext } from "./validation-context";

export class PropertyRule<TRoot, TProperty> {
  constructor(
    readonly property: string,
    readonly getter: (item: TRoot) => TProperty,
    readonly checkers: Array<RuleChecker<TRoot, TProperty>> = []
  ) {}

  async verify(context: ValidationContext<TRoot>): Promise<Inconsistency[]> {
    const { parent, cascade } = context;
    const propertyValue = this.getter(parent);
    const inconsistencies: Inconsistency[] = [];

    for (const checker of this.checkers) {
      const propertyContext = new PropertyValidationContext(
        context,
        [this.property],
        this.property,
        propertyValue
      );

      const inconsistency = await checker.check(propertyContext);

      if (!inconsistency) {
        continue;
      }

      inconsistencies.push(inconsistency);

      if (cascade === CascadeChecking.StopOnFirstError) {
        break;
      }
    }

    return inconsistencies;
  }

  toString(): string {
    return `PropertyRule(property="${this.property}")`;
  }
}
