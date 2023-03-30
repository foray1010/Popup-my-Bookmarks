import * as React from 'react'

export function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value)
  ref.current = value
  return ref
}
