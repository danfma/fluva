import { PropertyValidationContext } from "../property-validation-context";
import { Inconsistency } from "../inconsistency";
import { Maybe } from "../utils";
import { MinLengthRule } from "./min-length";

export type AcceptedType = Maybe<string>;

export class NotEmptyRule<TRoot> extends MinLengthRule<TRoot> {
  constructor() {
    super(1);
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, AcceptedType>
  ): Promise<Inconsistency | undefined> {
    const Inconsistency = await super.checkValue(context);

    return (
      Inconsistency?.with({
        errorType: "notEmpty",
        message: "validation.rule.notEmpty",
      }) ?? undefined
    );
  }
}

export function notEmpty<TRoot>(): NotEmptyRule<TRoot> {
  return new NotEmptyRule<TRoot>();
}
