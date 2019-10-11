import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

import KeyBindingsContext, {
  KeyBindingEventCallback,
} from './KeyBindingsContext'
import useKeyBindingsContextState from './useKeyBindingsContextState'

interface Props {
  children: React.ReactNode
}
const KeyBindingsProvider = (props: Props) => {
  const contextState = useKeyBindingsContextState()

  const contextStateRef = React.useRef(contextState)
  contextStateRef.current = contextState

  useEventListener(window, 'keydown', evt => {
    const { keyBindingsPerWindow, activeWindowId } = contextStateRef.current

    if (!activeWindowId) return

    const keyBindings = keyBindingsPerWindow.get(activeWindowId)
    if (!keyBindings) return

    interface MatchResult {
      isMatched: boolean
      callback?: KeyBindingEventCallback
    }
    const matchResult = keyBindings.reduceRight(
      (acc: MatchResult, keyBinding) => {
        if (acc.isMatched) return acc

        const isMatched =
          keyBinding.key instanceof RegExp
            ? keyBinding.key.test(evt.key)
            : keyBinding.key === evt.key
        if (!isMatched) return acc

        return {
          isMatched: true,
          callback: keyBinding.callback,
        }
      },
      {
        isMatched: false,
        callback: undefined,
      },
    )

    if (matchResult.isMatched && matchResult.callback) {
      matchResult.callback(evt)
    }
  })

  return (
    <KeyBindingsContext.Provider value={contextState}>
      {props.children}
    </KeyBindingsContext.Provider>
  )
}

export default KeyBindingsProvider
