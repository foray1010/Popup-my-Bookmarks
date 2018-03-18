// @flow

import {createActions} from 'reduxsauce'

export const {Creators: editorCreators, Types: editorTypes} = createActions({
  closeEditor: null,
  openEditor: ['targetId', 'coordinates', 'isCreating'],
  setEditor: ['newState']
})
