export type KeyDefinition = string | RegExp

export type KeyBindingMeta = Readonly<{
  key: KeyDefinition
  windowId: string
}>

export type KeyBindingEventCallback = (evt: KeyboardEvent) => void
