import constate from 'constate'
import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

import useMapDispatchToCallback from '../../hooks/useMapDispatchToCallback'
import type {
  KeyBindingEventCallback,
  KeyBindingMeta,
} from './reducers/keyBindingsPerWindow'
import {
  keyBindingsPerWindowCreators,
  keyBindingsPerWindowInitialState,
  keyBindingsPerWindowReducer,
} from './reducers/keyBindingsPerWindow'
import {
  windowsCreators,
  windowsInitialState,
  windowsReducer,
} from './reducers/windows'

export type { KeyBindingEventCallback, KeyBindingMeta }

const useKeyBindingsState = () => {
  const [{ activeWindowId }, dispatchWindows] = React.useReducer(
    windowsReducer,
    windowsInitialState,
  )
  const [keyBindingsPerWindow, dispatchKeyBindingsPerWindow] = React.useReducer(
    keyBindingsPerWindowReducer,
    keyBindingsPerWindowInitialState,
  )

  const addEventListener = useMapDispatchToCallback(
    dispatchKeyBindingsPerWindow,
    keyBindingsPerWindowCreators.addEventListener,
  )

  const removeEventListener = useMapDispatchToCallback(
    dispatchKeyBindingsPerWindow,
    keyBindingsPerWindowCreators.removeEventListener,
  )

  const setActiveWindowId = useMapDispatchToCallback(
    dispatchWindows,
    windowsCreators.setActiveWindowId,
  )

  const unsetActiveWindowId = useMapDispatchToCallback(
    dispatchWindows,
    windowsCreators.unsetActiveWindowId,
  )

  return React.useMemo(
    () => ({
      activeWindowId,
      keyBindingsPerWindow,
      addEventListener,
      removeEventListener,
      setActiveWindowId,
      unsetActiveWindowId,
    }),
    [
      activeWindowId,
      addEventListener,
      keyBindingsPerWindow,
      removeEventListener,
      setActiveWindowId,
      unsetActiveWindowId,
    ],
  )
}

const useKeyBindings = () => {
  const state = useKeyBindingsState()

  const stateRef = React.useRef(state)
  stateRef.current = state

  useEventListener(window, 'keydown', (evt) => {
    const { keyBindingsPerWindow, activeWindowId } = stateRef.current

    if (!activeWindowId) return

    const keyBindings = keyBindingsPerWindow.get(activeWindowId)
    if (!keyBindings) return

    interface MatchResult {
      isMatched: boolean
      callback?: KeyBindingEventCallback
    }
    const matchResult = keyBindings.reduceRight<MatchResult>(
      (acc, keyBinding) => {
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

  return state
}

export const [KeyBindingsProvider, useKeyBindingsContext] = constate(
  useKeyBindings,
)
