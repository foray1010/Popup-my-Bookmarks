import * as React from 'react'

import KeyBindingsContext, {KeyBindingMeta} from './KeyBindingsContext'

const useKeyBindingsEvent = (
  {key, level, priority}: KeyBindingMeta,
  callback?: (evt: KeyboardEvent) => void
) => {
  const {addEventListener, removeEventListener} = React.useContext(KeyBindingsContext)

  // use ref as `key` may be a RegExp instance and passing new reference every time
  // it made a trade-off, updating key now doesn't rerun addEventListener/removeEventListener
  const keyRef = React.useRef(key)
  keyRef.current = key

  React.useEffect(() => {
    const meta = {key: keyRef.current, level, priority}

    if (callback) addEventListener(meta, callback)

    return () => {
      if (callback) removeEventListener(meta, callback)
    }
  }, [addEventListener, callback, level, priority, removeEventListener])
}

export default useKeyBindingsEvent
