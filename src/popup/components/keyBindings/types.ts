export type KeyDefinition = Readonly<string | RegExp>

export type KeyBindingMeta = Readonly<{
  key: KeyDefinition
  windowId: string
}>

export type KeyBindingEventCallback = (evt: Readonly<KeyboardEvent>) => void
