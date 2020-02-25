import { isString } from "./is-string"
import { isArrayLike } from "./is-array-like"

export function isStringOrArray(value: any): value is string | ArrayLike<any> {
  return isString(value) || isArrayLike(value)
}
