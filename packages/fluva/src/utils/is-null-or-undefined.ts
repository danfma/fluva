// eslint-disable-next-line @rushstack/no-new-null
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
