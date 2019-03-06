import {ActionType, getType} from 'typesafe-actions'

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

export const editorReducer = (
  state: EditorState = INITIAL_STATE,
  action: ActionType<typeof editorCreators>
): EditorState => {
  switch (action.type) {
    case getType(editorCreators.closeEditor):
      return INITIAL_STATE

    case getType(editorCreators.setEditor):
      return {
        ...state,
        ...action.payload.partialState
      }

    default:
      return state
  }
}
