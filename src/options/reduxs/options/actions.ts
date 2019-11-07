import { createAction } from 'typesafe-actions'

import { Options } from '../../../core/types/options'

export const reloadOptions = createAction('RELOAD_OPTIONS')()

export const resetToDefaultOptions = createAction('RESET_TO_DEFAULT_OPTIONS')()

export const saveOptions = createAction('SAVE_OPTIONS')()

export const updateOptions = createAction(
  'UPDATE_OPTIONS',
  (options: Options) => ({ options }),
)()

export const updatePartialOptions = createAction(
  'UPDATE_PARTIAL_OPTIONS',
  (partialOptions: Partial<Options>) => partialOptions,
)()
