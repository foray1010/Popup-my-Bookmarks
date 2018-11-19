// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {editorCreators, editorTypes} from './actions'

type State = {|
  isAllowEditUrl: boolean,
  isCreating: boolean,
  positionLeft: number,
  positionTop: number,
  targetId: string,
  title: string,
  url: string
|}
const INITIAL_STATE: State = {
  isAllowEditUrl: false,
  isCreating: false,
  positionLeft: 0,
  positionTop: 0,
  targetId: '',
  title: '',
  url: ''
}

const closeEditor = (): State => INITIAL_STATE

const setEditor = (
  state: State,
  {payload}: ActionType<typeof editorCreators.setEditor>
): State => ({
  ...state,
  ...payload.partialState
})

export const editorReducer = handleActions(
  {
    [editorTypes.CLOSE_EDITOR]: closeEditor,
    [editorTypes.SET_EDITOR]: setEditor
  },
  INITIAL_STATE
)
