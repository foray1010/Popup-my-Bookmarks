import { useDeepCompareEffect } from 'use-deep-compare'

import { useLatestRef } from '../../../core/hooks/useLatestRef.js'
import { useKeyBindingsContext } from './KeyBindingsContext.js'
import type { KeyBindingMeta } from './types.js'

export default function useKeyBindingsEvent(
  meta: Readonly<KeyBindingMeta>,
  callback: (evt: Readonly<KeyboardEvent>) => void | Promise<void>,
) {
  const { addEventListener, removeEventListener } = useKeyBindingsContext()

  const callbackRef = useLatestRef(callback)

  useDeepCompareEffect(() => {
    function wrappedCallback(evt: Readonly<KeyboardEvent>) {
      const maybePromise = callbackRef.current(evt)
      if (maybePromise !== undefined) {
        maybePromise.catch(console.error)
      }
    }

    addEventListener(meta, wrappedCallback)

    return () => {
      removeEventListener(meta, wrappedCallback)
    }
  }, [addEventListener, callbackRef, meta, removeEventListener])
}
