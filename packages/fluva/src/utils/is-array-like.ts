import { Maybe } from "./types";

export function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  const candidate = value as Maybe<ArrayLike<unknown>>;

  return (
    !!candidate && "length" in candidate && typeof candidate.length === "number"
  );
}
