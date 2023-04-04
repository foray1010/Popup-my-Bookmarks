import constate from 'constate'
import * as React from 'react'
import useEventListener from 'use-typed-event-listener'

import type { KeyBindingEventCallback, KeyDefinition } from './types.js'

const useActiveWindowState = () => {
  const [activeWindowQueue, setActiveWindowQueue] = React.useState<
    readonly string[]
  >([])

  const appendActiveWindowId = React.useCallback((windowId: string) => {
    setActiveWindowQueue((prevState) => [
      ...prevState.filter((x) => x !== windowId),
      windowId,
    ])
  }, [])

  const removeActiveWindowId = React.useCallback((windowId: string) => {
    setActiveWindowQueue((prevState) => prevState.filter((x) => x !== windowId))
  }, [])

  return {
    activeWindowId: activeWindowQueue.at(-1),
    appendActiveWindowId,
    removeActiveWindowId,
  }
}

const useKeyBindingsPerWindowState = () => {
  const [keyBindingsPerWindow, setKeyBindingsPerWindow] = React.useState<
    ReadonlyMap<
      string,
      ReadonlyArray<{
        readonly key: KeyDefinition
        readonly callback: KeyBindingEventCallback
      }>
    >
  >(new Map())

  type AddOrRemoveEventListener = (
    meta: {
      readonly key: KeyDefinition
      readonly windowId: string
    },
    callback: KeyBindingEventCallback,
  ) => void

  const addEventListener: AddOrRemoveEventListener = React.useCallback(
    ({ key, windowId }, callback) => {
      setKeyBindingsPerWindow((prevState) => {
        const keyBindings = prevState.get(windowId)

        const updatedKeyBindings = [...(keyBindings ?? []), { callback, key }]

        return new Map(prevState).set(windowId, updatedKeyBindings)
      })
    },
    [],
  )

  const removeEventListener: AddOrRemoveEventListener = React.useCallback(
    ({ key, windowId }, callback) => {
      setKeyBindingsPerWindow((prevState) => {
        const keyBindings = prevState.get(windowId)
        if (!keyBindings) return prevState

        const updatedKeyBindings = keyBindings.filter((keyBinding) => {
          return (
            keyBinding.callback !== callback ||
            keyBinding.key.toString() !== key.toString()
          )
        })

        return new Map(prevState).set(windowId, updatedKeyBindings)
      })
    },
    [],
  )

  return {
    keyBindingsPerWindow,
    addEventListener,
    removeEventListener,
  }
}

const useKeyBindingsState = () => {
  const activeWindowState = useActiveWindowState()

  const keyBindingsPerWindowState = useKeyBindingsPerWindowState()

  return {
    ...activeWindowState,
    ...keyBindingsPerWindowState,
  }
}

const useKeyBindings = () => {
  const state = useKeyBindingsState()

  useEventListener(document, 'keydown', (evt) => {
    const { keyBindingsPerWindow, activeWindowId } = state
    if (!activeWindowId) return

    const keyBindings = keyBindingsPerWindow.get(activeWindowId)
    if (!keyBindings) return

    const matchedKeyBindings = Array.from(keyBindings)
      .reverse()
      .filter((keyBinding) => {
        return keyBinding.key instanceof RegExp
          ? keyBinding.key.test(evt.key)
          : keyBinding.key === evt.key
      })

    matchedKeyBindings.forEach((keyBinding) => {
      keyBinding.callback(evt)
    })
  })

  return state
}

export const [KeyBindingsProvider, useKeyBindingsContext] =
  constate(useKeyBindings)
