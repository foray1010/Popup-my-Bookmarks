// @flow strict

import {handleActions} from 'redux-actions'

import type {Options} from '../../../common/types/options'

type State = $Shape<Options>
const INITIAL_STATE: State = {}

export const optionsReducer = handleActions({}, INITIAL_STATE)
