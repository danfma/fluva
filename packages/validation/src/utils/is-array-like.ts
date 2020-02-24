export function isArrayLike(value: any): value is ArrayLike<any> {
  return 'length' in value && typeof value.length === 'number'
}
