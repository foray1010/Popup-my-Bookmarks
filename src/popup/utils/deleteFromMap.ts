export default function deleteFromMap<K, V>(
  map: ReadonlyMap<K, V>,
  key: K,
): Map<K, V> {
  const clonedMap = new Map(map)
  clonedMap.delete(key)
  return clonedMap
}
