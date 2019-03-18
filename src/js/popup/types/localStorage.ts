interface LastPosition {
  id: string
  scrollTop: number
}

export type LocalStorage = Partial<{
  lastPositions: Array<LastPosition>
}>
