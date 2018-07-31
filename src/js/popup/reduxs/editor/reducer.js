// @flow strict

import {handleActions} from 'redux-actions'
import type {ActionType} from 'redux-actions'

import {editorCreators, editorTypes} from './actions'

const INITIAL_STATE = {
  isAllowEditUrl: false,
  isCreating: false,
  positionLeft: 0,
  positionTop: 0,
  targetId: '',
  title: '',
  url: ''
}

const closeEditor = () => INITIAL_STATE

const setEditor = (state, {payload}: ActionType<typeof editorCreators.setEditor>) => ({
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
