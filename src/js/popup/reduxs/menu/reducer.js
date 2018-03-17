// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import type {MenuPattern} from '../../types'
import {menuTypes} from './actions'

type MenuState = {|
  focusedRow: string,
  menuPattern: MenuPattern,
  positionLeft: number,
  positionTop: number,
  targetId: string
|}

const INITIAL_STATE: MenuState = Immutable({
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
const openMenu = (state: MenuState, {positionLeft, positionTop, targetId}: OpenMenuPayload) =>
  Immutable.merge(state, {
    positionLeft,
    positionTop,
    targetId
  })

const removeFocusedRow = (state: MenuState) => Immutable.set(state, 'focusedRow', '')

type SetFocusedRowPayload = {|
  focusedRow: string
|}
const setFocusedRow = (state: MenuState, {focusedRow}: SetFocusedRowPayload) =>
  Immutable.merge(state, {focusedRow})

type SetMenuPatternPayload = {|
  menuPattern: MenuPattern
|}
const setMenuPattern = (state: MenuState, {menuPattern}: SetMenuPatternPayload) =>
  Immutable.merge(state, {menuPattern})

export const menuReducer = createReducer(INITIAL_STATE, {
  [menuTypes.CLOSE_MENU]: closeMenu,
  [menuTypes.OPEN_MENU]: openMenu,
  [menuTypes.REMOVE_FOCUSED_ROW]: removeFocusedRow,
  [menuTypes.SET_FOCUSED_ROW]: setFocusedRow,
  [menuTypes.SET_MENU_PATTERN]: setMenuPattern
})
