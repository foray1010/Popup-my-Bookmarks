export type KeyDefinition = string | RegExp

export type KeyBindingMeta = {
  readonly key: KeyDefinition
  readonly windowId: string
}

export type KeyBindingEventCallback = (evt: KeyboardEvent) => void
