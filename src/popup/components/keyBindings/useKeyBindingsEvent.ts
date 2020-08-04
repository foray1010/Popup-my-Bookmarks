import * as React from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'

import type { KeyBindingMeta } from './KeyBindingsContext'
import { useKeyBindingsContext } from './KeyBindingsContext'

const useKeyBindingsEvent = (
  meta: KeyBindingMeta,
  callback: (evt: KeyboardEvent) => void,
) => {
  const { addEventListener, removeEventListener } = useKeyBindingsContext()

  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  useDeepCompareEffect(() => {
    const wrappedCallback = (evt: KeyboardEvent) => {
      callbackRef.current(evt)
    }

    addEventListener(meta, wrappedCallback)

    return () => {
      removeEventListener(meta, wrappedCallback)
    }
  }, [addEventListener, meta, removeEventListener])
}

export default useKeyBindingsEvent
