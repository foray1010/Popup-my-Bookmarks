import { type RefObject, useLayoutEffect, useRef } from 'react'

export function useLatestRef<T>(value: T): Readonly<RefObject<T>> {
  const ref = useRef(value)

  useLayoutEffect(() => {
    ref.current = value
  }, [value])

  return ref
}
