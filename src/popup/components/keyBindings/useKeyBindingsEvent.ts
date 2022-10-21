import * as React from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'

import { useKeyBindingsContext } from './KeyBindingsContext.js'
import type { KeyBindingMeta } from './types.js'

export default function useKeyBindingsEvent(
  meta: KeyBindingMeta,
  callback: (evt: KeyboardEvent) => void | Promise<void>,
) {
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
