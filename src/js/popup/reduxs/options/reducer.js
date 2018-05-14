// @flow strict

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

const INITIAL_STATE = Immutable({})

export const optionsReducer = createReducer(INITIAL_STATE, {})
