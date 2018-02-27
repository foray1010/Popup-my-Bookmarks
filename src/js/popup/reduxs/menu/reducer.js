// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import type {MenuPattern} from '../../types'
import {menuTypes} from './actions'

const INITIAL_STATE = Immutable({
  focusedRow: '',
  menuPattern: [],
  positionLeft: 0,
  positionTop: 0,
  targetId: ''
})

const closeMenu = () => INITIAL_STATE

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

const removeFocusedRow = (state) => Immutable.set(state, 'focusedRow', '')

type SetFocusedRowPayload = {|
  focusedRow: string
|}
const setFocusedRow = (state, {focusedRow}: SetFocusedRowPayload) =>
  Immutable.merge(state, {focusedRow})

type SetMenuPatternPayload = {|
  menuPattern: MenuPattern
|}
const setMenuPattern = (state, {menuPattern}: SetMenuPatternPayload) =>
  Immutable.merge(state, {menuPattern})

export const menuReducer = createReducer(INITIAL_STATE, {
  [menuTypes.CLOSE_MENU]: closeMenu,
  [menuTypes.OPEN_MENU]: openMenu,
  [menuTypes.REMOVE_FOCUSED_ROW]: removeFocusedRow,
  [menuTypes.SET_FOCUSED_ROW]: setFocusedRow,
  [menuTypes.SET_MENU_PATTERN]: setMenuPattern
})
