import * as React from 'react'

import useMapDispatchToCallback from '../../hooks/useMapDispatchToCallback'
import type { KeyBindingsContextType } from './KeyBindingsContext'
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

const useKeyBindingsContextState = (): KeyBindingsContextType => {
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

export default useKeyBindingsContextState
