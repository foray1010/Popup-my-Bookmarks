import type { ValueOf } from 'type-fest'

import type { MenuItem } from './constants.js'

export type MenuPattern = ReadonlyArray<ReadonlyArray<ValueOf<typeof MenuItem>>>
