const cycle = (start: number, end: number, value: number) => {
  if (value < start) return end
  if (value > end) return start
  return value
}

export default cycle
