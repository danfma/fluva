import { ValidationContext } from "./validation-context"

export class PropertyValidationContext<TRoot = unknown, TProperty = unknown> {
  constructor(
    readonly validationContext: ValidationContext<TRoot>,
    readonly propertyPath: string[],
    readonly propertyName: string,
    readonly propertyValue: TProperty
  ) {

  }

  get parent(): TRoot {
    return this.validationContext.parent
  }

  get fullPropertyPath(): string {
    return [...this.propertyPath].join('.')
  }
}
