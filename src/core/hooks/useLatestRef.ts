import { type RefObject, useRef } from 'react'

export function useLatestRef<T>(value: T): Readonly<RefObject<T>> {
  const ref = useRef(value)
  ref.current = value
  return ref
}
