import { Unconformity } from "./unconformity";

export class ValidationResult {
  static readonly empty = new ValidationResult();

  constructor(readonly unconformities: Unconformity[] = []) {}

  get invalid(): boolean {
    return this.unconformities.length > 0;
  }
}
