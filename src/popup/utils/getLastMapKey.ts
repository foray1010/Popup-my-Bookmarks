const getLastMapKey = <K extends number | string, V>(
  map: Map<K, V>,
): K | undefined => {
  const indices = Array.from(map.keys()).sort()
  return indices[indices.length - 1]
}

export default getLastMapKey
