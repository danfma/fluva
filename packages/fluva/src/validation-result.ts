import { Inconsistency } from "./inconsistency";

export class ValidationResult {
  static readonly empty = new ValidationResult();

  constructor(readonly inconsistencies: Inconsistency[] = []) {}

  get hasInconsistencies(): boolean {
    return this.inconsistencies.length > 0;
  }

  filterByPropertyPath(
    path: string,
    options?: { exactMatch: boolean }
  ): Inconsistency[] {
    const { exactMatch } = options ?? {};

    return this.inconsistencies.filter((inconsistency) =>
      exactMatch
        ? inconsistency.validatingPathAsString === path
        : inconsistency.validatingPathAsString.startsWith(path)
    );
  }
}
