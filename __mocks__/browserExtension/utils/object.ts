export function pick<T extends Record<string, unknown>, U extends keyof T>(
  object: T,
  keys: readonly U[],
): Pick<T, U> {
  const acc = {} as Pick<T, U>
  for (const key of keys) {
    if (Object.hasOwn(object, key)) {
      acc[key] = object[key]
    }
  }
  return acc
}
