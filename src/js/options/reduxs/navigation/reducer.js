import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {NAV_MODULE_GENERAL} from '../../constants'
import {navigationTypes} from './actions'

const INITIAL_STATE = Immutable({
  selectedNavModule: NAV_MODULE_GENERAL
})

const switchNavModule = (state, {navModule}) =>
  Immutable.merge(state, {selectedNavModule: navModule})

export const navigationReducer = createReducer(INITIAL_STATE, {
  [navigationTypes.SWITCH_NAV_MODULE]: switchNavModule
})
