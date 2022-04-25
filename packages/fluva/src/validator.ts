import { CascadeChecking } from "./cascade-checking";
import { ValidationContext } from "./validation-context";
import { ValidationResult } from "./validation-result";

export interface Validator<T> {
  /**
   * Validates the specified instance.
   *
   * @param instance The instance to be validated.
   * @param properties The properties of the instance for validating.
   *                   If no property is specified, then all the rules will be
   *                   verified against the instance.
   * @param cascade Determines if the checker behaviour when an error was found.
   */
  validate(
    instance: T | ValidationContext<T>,
    properties?: string[],
    cascade?: CascadeChecking
  ): Promise<ValidationResult>;

  /**
   * Try to validate the specified instance or throw an {ValidationError} error.
   *
   * @param instance The instance to be validated.
   * @param properties The properties of the instance for validating.
   *                   If no property is specified, then all the rules will be
   *                   verified against the instance.
   * @param cascade Determines if the checker behaviour when an error was found.
   */
  validateOrThrow(
    instance: T,
    properties?: string[],
    cascade?: CascadeChecking
  ): void;
}
