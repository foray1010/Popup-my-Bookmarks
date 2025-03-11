import type { ValueOf } from 'type-fest'

import type { WindowId } from '../../constants/windows.js'

export type KeyDefinition = string | Readonly<RegExp>

export type KeyBindingMeta = Readonly<{
  key: KeyDefinition
  windowId: ValueOf<typeof WindowId>
}>

export type KeyBindingEventCallback = (evt: Readonly<KeyboardEvent>) => void
