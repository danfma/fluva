import { RuleChecker } from "./rule-checker";
import { Validator } from "./validator";

export interface RuleBuilder<TRoot, TProperty> {
  verify(...checkers: Array<RuleChecker<TRoot, TProperty>>): void;
  useValidator(validator: Validator<TProperty>): void;
}
