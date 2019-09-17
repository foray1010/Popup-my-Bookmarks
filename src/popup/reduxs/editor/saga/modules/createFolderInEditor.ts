import {call, put} from 'redux-saga/effects'
import {ActionType} from 'typesafe-actions'

import {getI18n} from '../../../../../core/utils'
import * as editorCreators from '../../actions'

export function* createFolderInEditor({
  payload
}: ActionType<typeof editorCreators.createFolderInEditor>) {
  try {
    const title: string = yield call(getI18n, 'newFolder')

    yield put(
      editorCreators.setEditor({
        ...payload.coordinates,
        isAllowEditUrl: false,
        isCreating: true,
        targetId: payload.targetId,
        title
      })
    )
  } catch (err) {
    console.error(err)
  }
}
