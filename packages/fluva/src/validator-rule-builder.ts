import { Rule } from "./rule";
import { RuleBuilder } from "./rule-builder";
import { RuleChecker } from "./rule-checker";
import { Validator } from "./validator";
import { PropertyRule } from "./property-rule";
import { ValidatorDelegatedRule } from "./validator-delegated-rule";

export class ValidatorRuleBuilder<TRoot, TProperty>
  implements RuleBuilder<TRoot, TProperty>
{
  constructor(
    readonly property: keyof TRoot,
    readonly selector: (target: TRoot) => TProperty,
    readonly rules: Array<Rule<TRoot>>
  ) {}

  verify(...checkers: Array<RuleChecker<TRoot, TProperty>>): void {
    this.rules.push(
      new PropertyRule(this.property as string, this.selector, checkers)
    );
  }

  useValidator(validator: Validator<TProperty>): void {
    this.rules.push(
      new ValidatorDelegatedRule(
        this.property as string,
        this.selector,
        validator
      )
    );
  }
}
