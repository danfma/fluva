import { CascadeChecking } from "./cascade-checking"

export class ValidationContext<TRoot> {
  constructor(
    readonly parent: TRoot,
    readonly cascade: CascadeChecking) {
  }
}
