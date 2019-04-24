import {ActionType, createReducer} from 'typesafe-actions'

import * as editorCreators from './actions'
import {EditorState} from './types'

const INITIAL_STATE: EditorState = {
  isAllowEditUrl: false,
  isCreating: false,
  positionLeft: 0,
  positionTop: 0,
  targetId: '',
  title: '',
  url: ''
}

export const editorReducer = createReducer<EditorState, ActionType<typeof editorCreators>>(
  INITIAL_STATE
)
  .handleAction(editorCreators.closeEditor, () => INITIAL_STATE)
  .handleAction(editorCreators.setEditor, (state, {payload}) => {
    return {
      ...state,
      ...payload.partialState
    }
  })
