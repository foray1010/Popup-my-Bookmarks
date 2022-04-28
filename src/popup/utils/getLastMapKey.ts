export default function getLastMapKey<K extends number | string, V>(
  map: Map<K, V>,
): K | undefined {
  const indices = Array.from(map.keys()).sort()
  return indices.at(-1)
}
