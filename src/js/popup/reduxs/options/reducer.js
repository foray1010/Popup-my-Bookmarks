// @flow strict

import {handleActions} from 'redux-actions'

type State = Object
const INITIAL_STATE: State = {}

export const optionsReducer = handleActions({}, INITIAL_STATE)
