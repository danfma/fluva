import { Inconsistency, ValidationError } from "fluva"
import { action, computed, observable } from "mobx"

type Maybe<T> = T | null | undefined

export interface ReportedInconsistency {
  remotelyValidated?: boolean
  Inconsistency: Inconsistency
}

export interface UpdateResult {
  hasErrors: boolean
}

export class ValidationReport {
  static readonly empty = new ValidationReport();

  @observable
  readonly inconsistenciesByPath = observable.map<string, ReportedInconsistency>();

  @computed
  get hasErrors(): boolean {
    return this.inconsistenciesByPath.size > 0
  }

  @computed
  get allinconsistencies(): ReportedInconsistency[] {
    return [...this.inconsistenciesByPath.values()]
  }

  @computed
  get hasLocalErrors(): boolean {
    return this.allinconsistencies.some(failure => failure && !failure.remotelyValidated)
  }

  @computed
  get errorsCount(): number {
    return this.allinconsistencies.map(failure => !!failure).length
  }

  findInconsistency(propertyNameOrRegExp: string | RegExp): Inconsistency | null {
    let Inconsistency: Maybe<Inconsistency> = null

    if (typeof propertyNameOrRegExp === 'string') {
      Inconsistency = this.inconsistenciesByPath.get(propertyNameOrRegExp)?.Inconsistency
    } else {
      for (const [key, item] of this.inconsistenciesByPath.entries()) {
        if (propertyNameOrRegExp.test(key)) {
          Inconsistency = item?.Inconsistency
          break
        }
      }
    }

    return Inconsistency ?? null
  }

  hasInconsistency(property: string | RegExp): boolean {
    return !!this.findInconsistency(property)
  }

  @action
  clear(properties: string[] = []): void {
    if (properties.length > 0) {
      properties.forEach(property => {
        this.inconsistenciesByPath.delete(property)
      })
    } else {
      this.inconsistenciesByPath.clear()
    }
  }

  @action
  clearError(property: string): void {
    this.inconsistenciesByPath.delete(property)
  }

  @action
  setError(property: string, Inconsistency: Inconsistency | null, remotelyValidated = false): void {
    if (Inconsistency) {
      this.inconsistenciesByPath.set(property, { Inconsistency, remotelyValidated })
    } else if (this.inconsistenciesByPath.has(property)) {
      this.inconsistenciesByPath.delete(property)
    }
  }

  private toinconsistenciesMap(inconsistencies: Inconsistency[]): Map<string, Inconsistency | null> {
    return new Map<string, Inconsistency | null>(
      inconsistencies.map(Inconsistency => [Inconsistency.validatingPath.join('.'), Inconsistency])
    )
  }

  @action
  update(properties: string[], inconsistencies: Inconsistency[], remotelyValidated = false): void {
    this.clear(properties)

    for (const [property, Inconsistency] of this.toinconsistenciesMap(inconsistencies)) {
      this.setError(property, Inconsistency, remotelyValidated)
    }
  }

  @action
  updateFromValidationError(validationError: ValidationError): void {
    this.update(validationError.validatedProperties, validationError.inconsistencies, validationError.remotelyValidated)
  }

  handleError(e: Error): boolean {
    if (e instanceof ValidationError) {
      this.updateFromValidationError(e)
      return true
    }

    return false
  }
}
