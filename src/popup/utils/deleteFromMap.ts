export default function deleteFromMap<K, V>(
  map: ReadonlyMap<K, V>,
  key: K,
): ReadonlyMap<K, V> {
  const clonedMap = new Map(map)
  clonedMap.delete(key)
  return clonedMap
}
