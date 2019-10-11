import { call, put } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import webExtension from 'webextension-polyfill'

import { queryTabs } from '../../../../../core/utils'
import * as bookmarkCreators from '../../actions'

export function* addCurrentPage({
  payload,
}: ActionType<typeof bookmarkCreators.addCurrentPage>) {
  try {
    const [currentTab]: Array<webExtension.tabs.Tab> = yield call(queryTabs, {
      currentWindow: true,
      active: true,
    })

    yield put(
      bookmarkCreators.createBookmark(
        payload.parentId,
        payload.index,
        currentTab.title || '',
        currentTab.url || '',
      ),
    )
  } catch (err) {
    console.error(err)
  }
}
