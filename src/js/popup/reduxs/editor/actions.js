// @flow

import {createActions} from 'reduxsauce'

export const {Creators: editorCreators, Types: editorTypes} = createActions({
  closeEditor: null,
  createFolderInEditor: ['targetId', 'coordinates'],
  openEditor: ['targetId', 'coordinates'],
  setEditor: ['partialState']
})
