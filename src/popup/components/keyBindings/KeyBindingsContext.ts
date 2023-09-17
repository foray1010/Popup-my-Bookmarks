import constate from 'constate'
import * as React from 'react'
import useListener from 'use-typed-event-listener'

import type { WindowId } from '../../constants/windows.js'
import type { KeyBindingEventCallback, KeyDefinition } from './types.js'

function useActiveWindowState() {
  const [activeWindowQueue, setActiveWindowQueue] = React.useState<
    ReadonlySet<WindowId>
  >(new Set())

  const appendActiveWindowId = React.useCallback((windowId: WindowId) => {
    setActiveWindowQueue((prevState) => {
      const newState = new Set(prevState)
      newState.add(windowId)
      return newState
    })
  }, [])

  const removeActiveWindowId = React.useCallback((windowId: WindowId) => {
    setActiveWindowQueue((prevState) => {
      const newState = new Set(prevState)
      newState.delete(windowId)
      return newState
    })
  }, [])

  return {
    activeWindowId: Array.from(activeWindowQueue).at(-1),
    appendActiveWindowId,
    removeActiveWindowId,
  }
}

function useKeyBindingsPerWindowState() {
  const [keyBindingsPerWindow, setKeyBindingsPerWindow] = React.useState<
    ReadonlyMap<
      WindowId,
      ReadonlyArray<
        Readonly<{
          key: KeyDefinition
          callback: KeyBindingEventCallback
        }>
      >
    >
  >(new Map())

  type AddOrRemoveListener = (
    meta: Readonly<{ key: KeyDefinition; windowId: WindowId }>,
    callback: KeyBindingEventCallback,
  ) => void

  const addListener: AddOrRemoveListener = React.useCallback(
    ({ key, windowId }, callback) => {
      setKeyBindingsPerWindow((prevState) => {
        const keyBindings = prevState.get(windowId)

        const updatedKeyBindings = [...(keyBindings ?? []), { callback, key }]

        return new Map(prevState).set(windowId, updatedKeyBindings)
      })
    },
    [],
  )

  const removeListener: AddOrRemoveListener = React.useCallback(
    ({ key, windowId }, callback) => {
      setKeyBindingsPerWindow((prevState) => {
        const keyBindings = prevState.get(windowId)
        if (!keyBindings) return prevState

        const updatedKeyBindings = keyBindings.filter((keyBinding) => {
          return (
            keyBinding.callback !== callback ||
            String(keyBinding.key) !== String(key)
          )
        })

        return new Map(prevState).set(windowId, updatedKeyBindings)
      })
    },
    [],
  )

  return {
    keyBindingsPerWindow,
    addListener,
    removeListener,
  }
}

function useKeyBindingsState() {
  const activeWindowState = useActiveWindowState()

  const keyBindingsPerWindowState = useKeyBindingsPerWindowState()

  return {
    ...activeWindowState,
    ...keyBindingsPerWindowState,
  }
}

function useKeyBindings() {
  const state = useKeyBindingsState()

  useListener(document, 'keydown', (evt) => {
    const { keyBindingsPerWindow, activeWindowId } = state
    if (!activeWindowId) return

    const keyBindings = keyBindingsPerWindow.get(activeWindowId)
    if (!keyBindings) return

    const matchedKeyBindings = keyBindings
      .filter((keyBinding) => {
        return keyBinding.key instanceof RegExp
          ? keyBinding.key.test(evt.key)
          : keyBinding.key === evt.key
      })
      .reverse()

    matchedKeyBindings.forEach((keyBinding) => {
      keyBinding.callback(evt)
    })
  })

  return state
}

export const [KeyBindingsProvider, useKeyBindingsContext] =
  constate(useKeyBindings)
