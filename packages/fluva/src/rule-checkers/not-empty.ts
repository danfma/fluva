import { PropertyValidationContext } from "../property-validation-context";
import { Unconformity } from "../unconformity";
import { Maybe } from "../utils";
import { MinLengthRule } from "./min-length";

export type AcceptedType = Maybe<string>;

export class NotEmptyRule<TRoot> extends MinLengthRule<TRoot> {
  constructor() {
    super(1);
  }

  protected async checkValue(
    context: PropertyValidationContext<TRoot, AcceptedType>
  ): Promise<Unconformity | undefined> {
    const unconformity = await super.checkValue(context);

    return (
      unconformity?.with({
        errorType: "notEmpty",
        message: "validation.rule.notEmpty",
      }) ?? undefined
    );
  }
}

export function notEmpty<TRoot>(): NotEmptyRule<TRoot> {
  return new NotEmptyRule<TRoot>();
}
