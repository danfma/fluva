import { isString } from "./is-string";
import { isArrayLike } from "./is-array-like";

export function isStringOrArray(
  value: unknown
): value is string | ArrayLike<unknown> {
  return isString(value) || isArrayLike(value);
}
