import {createAction} from 'typesafe-actions'

import {EditorState} from './types'

export const closeEditor = createAction('CLOSE_EDITOR')

export const createFolderInEditor = createAction(
  'CREATE_FOLDER_IN_EDITOR',
  action => (
    targetId: string,
    coordinates: {
      positionLeft: number
      positionTop: number
    }
  ) => action({targetId, coordinates})
)

export const openEditor = createAction(
  'OPEN_EDITOR',
  action => (
    targetId: string,
    coordinates: {
      positionLeft: number
      positionTop: number
    }
  ) => action({targetId, coordinates})
)

export const setEditor = createAction(
  'SET_EDITOR',
  action => (partialState: Partial<EditorState>) =>
    action({
      partialState
    })
)
