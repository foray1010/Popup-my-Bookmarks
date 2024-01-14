import { type MutableRefObject, useRef } from 'react'

export function useLatestRef<T>(value: T): Readonly<MutableRefObject<T>> {
  const ref = useRef(value)
  ref.current = value
  return ref
}
