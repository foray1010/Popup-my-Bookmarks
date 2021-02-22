export default function deleteFromMap<K, V>(map: Map<K, V>, key: K): Map<K, V> {
  const clonedMap = new Map(map)
  clonedMap.delete(key)
  return clonedMap
}
