// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {menuTypes} from './actions'

const INITIAL_STATE = Immutable({
  positionLeft: 0,
  positionTop: 0,
  targetId: ''
})

type OpenMenuPayload = {|
  positionLeft: number,
  positionTop: number,
  targetId: string
|}
const openMenu = (state, {positionLeft, positionTop, targetId}: OpenMenuPayload) =>
  Immutable.merge(state, {
    positionLeft,
    positionTop,
    targetId
  })

export const menuReducer = createReducer(INITIAL_STATE, {
  [menuTypes.OPEN_MENU]: openMenu
})
