import * as React from 'react'

export type KeyDefinition = string | RegExp

export type KeyBindingMeta = Readonly<{
  key: KeyDefinition
  level?: number
  priority?: number
}>

export type KeyBindingEventCallback = (evt: KeyboardEvent) => void

export type KeyBinding = Readonly<{
  priority: number
  key: KeyDefinition
  callback: KeyBindingEventCallback
}>

export interface KeyBindingsContextType {
  currentLayerLevel: number
  keyBindingsPerLevel: Map<number, ReadonlyArray<KeyBinding>>
  addEventListener: (meta: KeyBindingMeta, callback: KeyBindingEventCallback) => void
  removeEventListener: (meta: KeyBindingMeta, callback: KeyBindingEventCallback) => void
  setLayerLevel: (level: number) => void
}

export default React.createContext<KeyBindingsContextType>({
  currentLayerLevel: 0,
  keyBindingsPerLevel: new Map(),
  addEventListener: () => {},
  removeEventListener: () => {},
  setLayerLevel: () => {}
})
