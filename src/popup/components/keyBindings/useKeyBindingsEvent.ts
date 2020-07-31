import * as React from 'react'

import type { KeyBindingMeta } from './KeyBindingsContext'
import { useKeyBindingsContext } from './KeyBindingsContext'

const useKeyBindingsEvent = (
  { key, priority, windowId }: KeyBindingMeta,
  callback?: (evt: KeyboardEvent) => void,
) => {
  const { addEventListener, removeEventListener } = useKeyBindingsContext()

  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  // use ref as `key` may be a RegExp instance and passing new reference every time
  // it made a trade-off, updating key now doesn't rerun addEventListener/removeEventListener
  const keyRef = React.useRef(key)
  keyRef.current = key

  React.useEffect(() => {
    const meta = { key: keyRef.current, priority, windowId }

    const wrappedCallback = (evt: KeyboardEvent) => {
      if (callbackRef.current) {
        callbackRef.current(evt)
      }
    }

    addEventListener(meta, wrappedCallback)

    return () => {
      removeEventListener(meta, wrappedCallback)
    }
  }, [addEventListener, priority, removeEventListener, windowId])
}

export default useKeyBindingsEvent
