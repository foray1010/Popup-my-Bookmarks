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
  targetId: string,
  targetLeft: number,
  targetTop: number
|}

const INITIAL_STATE: MenuState = Immutable({
  focusedRow: '',
  menuPattern: [],
  positionLeft: 0,
  positionTop: 0,
  targetId: '',
  targetLeft: 0,
  targetTop: 0
})

const closeMenu = () => INITIAL_STATE

type OpenMenuPayload = {|
  coordinates: {|
    positionLeft: number,
    positionTop: number,
    targetLeft: number,
    targetTop: number
  |},
  targetId: string
|}
const openMenu = (state: MenuState, {coordinates, targetId}: OpenMenuPayload) =>
  Immutable.merge(state, {
    ...coordinates,
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
