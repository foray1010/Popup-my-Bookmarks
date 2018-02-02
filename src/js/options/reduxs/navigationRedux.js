import {createActions, createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {NAV_MODULE_GENERAL} from '../constants'

export const {Types, Creators} = createActions({
  switchNavModule: ['navModule']
})

const INITIAL_STATE = Immutable({
  selectedNavModule: NAV_MODULE_GENERAL
})
export default createReducer(INITIAL_STATE, {
  [Types.SWITCH_NAV_MODULE]: (state, {navModule}) =>
    Immutable.merge(state, {selectedNavModule: navModule})
})
