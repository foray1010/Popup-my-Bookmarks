/* @flow */

import {
  createAction
} from '../../common/functions'
import {
  initOptionsValue
} from '../functions'
import {
  SELECT_NAV_MODULE,
  UPDATE_OPTIONS,
  UPDATE_SINGLE_OPTION
} from '../constants'
import chromep from '../../common/lib/chromePromise'

const selectNavModule = createAction(
  SELECT_NAV_MODULE,
  (navModule: string): string => navModule
)

export const updateOptions = createAction(
  UPDATE_OPTIONS,
  (options: Object): Object => options
)

export const updateSingleOption = createAction(
  UPDATE_SINGLE_OPTION,
  (
    optionName: string,
    optionValue: boolean | number | number[] | string
  ): Object => ({
    optionName,
    optionValue
  })
)


/**
 * Following functions have side effect
 */

async function reloadOptions(): Object {
  const options: Object = await chromep.storage.sync.get(null)

  return updateOptions(options)
}

export function resetToDefaultOptions(): Function {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      optionsConfig
    }: {
      optionsConfig: Object
    } = getState()

    await chromep.storage.sync.clear()

    const options = await initOptionsValue(optionsConfig)

    dispatch(updateOptions(options))
  }
}

export function saveOptions(): Function {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      options
    }: {
      options: Object
    } = getState()

    await chromep.storage.sync.set(options)

    // seems meaningless for now
    dispatch(updateOptions(options))
  }
}

export function switchNavModule(navModule: string): Function {
  return async (
    dispatch: Function,
    getState: Function
  ): Promise<void> => {
    const {
      selectedNavModule
    }: {
      selectedNavModule: string
    } = getState()

    if (navModule !== selectedNavModule) {
      dispatch([
        await reloadOptions(),
        selectNavModule(navModule)
      ])
    }
  }
}
