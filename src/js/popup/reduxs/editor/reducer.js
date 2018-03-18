// @flow

import {createReducer} from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {editorTypes} from './actions'

type EditorState = {|
  isAllowEditUrl: boolean,
  isCreating: boolean,
  positionLeft: number,
  positionTop: number,
  targetId: string,
  title: string,
  url: string
|}

const INITIAL_STATE: EditorState = Immutable({
  isAllowEditUrl: false,
  isCreating: false,
  positionLeft: 0,
  positionTop: 0,
  targetId: ''
})

const closeEditor = () => INITIAL_STATE

type SetEditorPayload = {|
  newState: EditorState
|}
const setEditor = (state: EditorState, {newState}: SetEditorPayload) => newState

export const editorReducer = createReducer(INITIAL_STATE, {
  [editorTypes.CLOSE_EDITOR]: closeEditor,
  [editorTypes.SET_EDITOR]: setEditor
})
