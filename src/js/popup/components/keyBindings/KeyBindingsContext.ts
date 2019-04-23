import * as React from 'react'

export type KeyDefinition = string | RegExp

export type KeyBindingMeta = Readonly<{
  key: KeyDefinition
  priority?: number
  windowId: string
}>

export type KeyBindingEventCallback = (evt: KeyboardEvent) => void

export type KeyBinding = Readonly<{
  priority: number
  key: KeyDefinition
  callback: KeyBindingEventCallback
}>

export interface KeyBindingsContextType {
  activeWindowId?: string
  keyBindingsPerWindow: Map<string, ReadonlyArray<KeyBinding>>
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
