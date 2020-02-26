import { Unconformity, ValidationError } from "fluva"
import { action, computed, observable } from "mobx"

type Maybe<T> = T | null | undefined

export interface ReportedUnconformity {
  remotelyValidated?: boolean
  unconformity: Unconformity
}

export interface UpdateResult {
  hasErrors: boolean
}

export class ValidationReport {
  static readonly empty = new ValidationReport();

  @observable
  readonly unconformitiesByPath = observable.map<string, ReportedUnconformity>();

  @computed
  get hasErrors(): boolean {
    return this.unconformitiesByPath.size > 0
  }

  @computed
  get allUnconformities(): ReportedUnconformity[] {
    return [...this.unconformitiesByPath.values()]
  }

  @computed
  get hasLocalErrors(): boolean {
    return this.allUnconformities.some(failure => failure && !failure.remotelyValidated)
  }

  @computed
  get errorsCount(): number {
    return this.allUnconformities.map(failure => !!failure).length
  }

  findUnconformity(propertyNameOrRegExp: string | RegExp): Unconformity | null {
    let unconformity: Maybe<Unconformity> = null

    if (typeof propertyNameOrRegExp === 'string') {
      unconformity = this.unconformitiesByPath.get(propertyNameOrRegExp)?.unconformity
    } else {
      for (const [key, item] of this.unconformitiesByPath.entries()) {
        if (propertyNameOrRegExp.test(key)) {
          unconformity = item?.unconformity
          break
        }
      }
    }

    return unconformity ?? null
  }

  hasUnconformity(property: string | RegExp): boolean {
    return !!this.findUnconformity(property)
  }

  @action
  clear(properties: string[] = []): void {
    if (properties.length > 0) {
      properties.forEach(property => {
        this.unconformitiesByPath.delete(property)
      })
    } else {
      this.unconformitiesByPath.clear()
    }
  }

  @action
  clearError(property: string): void {
    this.unconformitiesByPath.delete(property)
  }

  @action
  setError(property: string, unconformity: Unconformity | null, remotelyValidated = false): void {
    if (unconformity) {
      this.unconformitiesByPath.set(property, { unconformity, remotelyValidated })
    } else if (this.unconformitiesByPath.has(property)) {
      this.unconformitiesByPath.delete(property)
    }
  }

  private toUnconformitiesMap(unconformities: Unconformity[]): Map<string, Unconformity | null> {
    return new Map<string, Unconformity | null>(
      unconformities.map(unconformity => [unconformity.validatingPath.join('.'), unconformity])
    )
  }

  @action
  update(properties: string[], unconformities: Unconformity[], remotelyValidated = false): void {
    this.clear(properties)

    for (const [property, unconformity] of this.toUnconformitiesMap(unconformities)) {
      this.setError(property, unconformity, remotelyValidated)
    }
  }

  @action
  updateFromValidationError(validationError: ValidationError): void {
    this.update(validationError.validatedProperties, validationError.unconformities, validationError.remotelyValidated)
  }

  handleError(e: Error): boolean {
    if (e instanceof ValidationError) {
      this.updateFromValidationError(e)
      return true
    }

    return false
  }
}
