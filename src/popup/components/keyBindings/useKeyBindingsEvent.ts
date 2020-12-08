import * as React from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'

import type { KeyBindingMeta } from './KeyBindingsContext'
import { useKeyBindingsContext } from './KeyBindingsContext'

const useKeyBindingsEvent = (
  meta: KeyBindingMeta,
  callback: (evt: KeyboardEvent) => void | Promise<void>,
) => {
  const { addEventListener, removeEventListener } = useKeyBindingsContext()

  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  useDeepCompareEffect(() => {
    const wrappedCallback = (evt: KeyboardEvent) => {
      const maybePromise = callbackRef.current(evt)
      if (maybePromise !== undefined) {
        maybePromise.catch(console.error)
      }
    }

    addEventListener(meta, wrappedCallback)

    return () => {
      removeEventListener(meta, wrappedCallback)
    }
  }, [addEventListener, meta, removeEventListener])
}

export default useKeyBindingsEvent
