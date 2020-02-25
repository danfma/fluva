
function appendAll<T>(accum: T[], next: T[]): T[] {
  accum.push(...next)
  return accum
}

export function flatten<T>(items: T[][]): T[] {
  return items.reduce(appendAll, Array<T>())
}
