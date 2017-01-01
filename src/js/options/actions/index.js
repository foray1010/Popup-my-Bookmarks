/* @flow */

import {static as Immutable} from 'seamless-immutable'

import {
  initOptionsValue
} from '../functions'
import {
  SELECT_NAV_MODULE,
  UPDATE_OPTIONS,
  UPDATE_SINGLE_OPTION
} from '../constants'
import chromep from '../../common/lib/chromePromise'

function selectNavModule(navModule: string): Object {
  return Immutable({
    type: SELECT_NAV_MODULE,
    navModule: navModule
  })
}

export function updateOptions(options: Object): Object {
  return Immutable({
    type: UPDATE_OPTIONS,
    options: options
  })
}

export function updateSingleOption(
  optionName: string,
  optionValue: boolean | number | number[] | string
): Object {
  return Immutable({
    type: UPDATE_SINGLE_OPTION,
    optionName: optionName,
    optionValue: optionValue
  })
}


/**
 * Following functions have side effect
 */

export async function reloadOptions(): Object {
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
