import * as React from 'react'

import {
  KeyBindingEventCallback,
  KeyBindingMeta,
  KeyBindingsPerWindowState
} from './reducers/keyBindingsPerWindow'
import {WindowsState} from './reducers/windows'

export {KeyBindingEventCallback, KeyBindingMeta}

export interface KeyBindingsContextType {
  activeWindowId: WindowsState['activeWindowId']
  keyBindingsPerWindow: KeyBindingsPerWindowState
  addEventListener: (meta: KeyBindingMeta, callback: KeyBindingEventCallback) => void
  removeEventListener: (meta: KeyBindingMeta, callback: KeyBindingEventCallback) => void
  setActiveWindowId: (windowId: string) => void
  unsetActiveWindowId: (windowId: string) => void
}

export default React.createContext<KeyBindingsContextType>({
  activeWindowId: undefined,
  keyBindingsPerWindow: new Map(),
  addEventListener: () => {},
  removeEventListener: () => {},
  setActiveWindowId: () => {},
  unsetActiveWindowId: () => {}
})
