/* @flow */

import {static as Immutable} from 'seamless-immutable'

import {
  SELECT_NAV_MODULE,
  UPDATE_OPTIONS,
  UPDATE_SINGLE_OPTION
} from '../constants'
import chromep from '../../common/lib/chromePromise'

/* basic action */
export function selectNavModule(navModule: string): Object {
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


/* advanced action */
export async function reloadOptions(): Object {
  const options: Object = await chromep.storage.sync.get(null)

  return updateOptions(options)
}
