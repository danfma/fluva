import { RuleChecker } from "./rule-checker"

export interface RuleBuilder<TRoot, TProperty> {
  verify(...checkers: RuleChecker<TRoot, TProperty>[]): void
}
