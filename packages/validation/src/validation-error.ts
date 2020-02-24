import { Unconformity } from "./unconformity"
import { ValidationResult } from "./validation-result"

export class ValidationError extends Error {
  constructor(
    readonly validationResult: ValidationResult,
    readonly validatedProperties: string[] = [],
    readonly remotelyValidated = false
  ) {
    super()
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  get unconformities(): Unconformity[] {
    return this.validationResult.unconformities
  }
}
