import Immutable from 'seamless-immutable'

import {
  SELECT_NAV_MODULE,
  UPDATE_OPTIONS,
  UPDATE_SINGLE_OPTION
} from '../constants/actionTypes'
import chromep from '../../common/lib/chromePromise'

/* basic action */
export function selectNavModule(navModule) {
  return Immutable({
    type: SELECT_NAV_MODULE,
    navModule: navModule
  })
}

export function updateOptions(options) {
  return Immutable({
    type: UPDATE_OPTIONS,
    options: options
  })
}

export function updateSingleOption(optionName, optionValue) {
  return Immutable({
    type: UPDATE_SINGLE_OPTION,
    optionName: optionName,
    optionValue: optionValue
  })
}


/* advanced action */
export async function reloadOptions() {
  const options = await chromep.storage.sync.get(null)

  return updateOptions(options)
}
