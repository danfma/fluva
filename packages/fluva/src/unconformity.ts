import { PropertyValidationContext } from "./property-validation-context";
import { Severity } from "./severity";

export class Unconformity {
  constructor(
    readonly errorType: string,
    readonly validatingPath: string[],
    readonly validatingFieldName: string,
    readonly severity = Severity.Error,
    readonly message = `validation.rule.${errorType}`,
    readonly additionalMessageParams: Record<string, unknown> = {}
  ) {}

  get validatingPathAsString(): string {
    return this.validatingPath.join(".");
  }

  with(data: Partial<Unconformity>): Unconformity {
    const {
      errorType = this.errorType,
      validatingPath = this.validatingPath,
      validatingFieldName = this.validatingFieldName,
      severity = this.severity,
      message = this.message,
      additionalMessageParams = this.additionalMessageParams,
    } = data;

    return new Unconformity(
      errorType,
      validatingPath,
      validatingFieldName,
      severity,
      message,
      additionalMessageParams
    );
  }

  static fromContext(
    context: PropertyValidationContext,
    errorType: string,
    additionalMessageParams: Record<string, unknown> = {}
  ): Unconformity {
    return new Unconformity(
      errorType,
      context.propertyPath,
      context.propertyName,
      undefined,
      undefined,
      additionalMessageParams
    );
  }
}
