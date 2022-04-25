import type { CascadeChecking } from "./cascade-checking";
import type { Rule } from "./rule";

export class ValidationContext<TRoot> {
  constructor(
    readonly parent: TRoot,
    readonly cascade: CascadeChecking,
    readonly propertiesToValidate: string[] = []
  ) {}

  getPropertiesToVerify(rules: Rule<TRoot>[]): string[] {
    return this.propertiesToValidate.length > 0
      ? this.propertiesToValidate
      : rules.map((x) => x.property);
  }
}
