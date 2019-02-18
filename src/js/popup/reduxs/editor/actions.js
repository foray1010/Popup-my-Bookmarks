// @flow strict

import {createAction} from 'redux-actions'

import type {State} from './types'

export const editorTypes = {
  CLOSE_EDITOR: 'CLOSE_EDITOR',
  CREATE_FOLDER_IN_EDITOR: 'CREATE_FOLDER_IN_EDITOR',
  OPEN_EDITOR: 'OPEN_EDITOR',
  SET_EDITOR: 'SET_EDITOR'
}

const closeEditor = createAction(editorTypes.CLOSE_EDITOR)

const createFolderInEditor = createAction(
  editorTypes.CREATE_FOLDER_IN_EDITOR,
  (
    targetId: string,
    coordinates: {|
      positionLeft: number,
      positionTop: number
    |}
  ) => ({targetId, coordinates})
)

const openEditor = createAction(
  editorTypes.OPEN_EDITOR,
  (
    targetId: string,
    coordinates: {|
      positionLeft: number,
      positionTop: number
    |}
  ) => ({targetId, coordinates})
)

const setEditor = createAction(editorTypes.SET_EDITOR, (partialState: $Shape<State>) => ({
  partialState
}))

export const editorCreators = {
  closeEditor,
  createFolderInEditor,
  openEditor,
  setEditor
}
