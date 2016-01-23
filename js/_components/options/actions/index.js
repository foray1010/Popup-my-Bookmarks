import chromep from '../../lib/chromePromise'
import Immutable from 'seamless-immutable'

/* action type */
export const SELECT_NAV_MODULE = 'SELECT_NAV_MODULE'
export const UPDATE_OPTIONS = 'UPDATE_OPTIONS'
export const UPDATE_OPTIONS_CONFIG = 'UPDATE_OPTIONS_CONFIG'
export const UPDATE_SINGLE_OPTION = 'UPDATE_SINGLE_OPTION'


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

export function updateOptionsConfig(optionsConfig) {
  return Immutable({
    type: UPDATE_OPTIONS_CONFIG,
    optionsConfig: optionsConfig
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
