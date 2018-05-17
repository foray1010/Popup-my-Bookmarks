// @flow strict

import * as R from 'ramda'
import type {ActionType} from 'redux-actions'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {createTab, createWindow, updateTab} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../actions'
import {getBookmarkInfo} from '../utils/getters'

const _createTabGenerator = (active: boolean) => (url: string) => call(createTab, {url, active})
const createActiveTab = _createTabGenerator(true)
const createBackgroundTab = _createTabGenerator(false)

function* getUrls(ids): Saga<Array<string>> {
  const bookmarkInfos = yield all(ids.map((id) => call(getBookmarkInfo, id)))
  return R.compose(
    R.pluck('url'),
    R.filter(R.both(R.propEq('isSimulated', false), R.propEq('type', CST.TYPE_BOOKMARK)))
  )(bookmarkInfos)
}

export function* openBookmarksInBrowser({
  payload
}: ActionType<typeof bookmarkCreators.openBookmarksInBrowser>): Saga<void> {
  const urls = yield call(getUrls, payload.ids)
  if (!urls.length) return

  /*
  if (urls.length > 5) {
    const msgAskOpenAllTemplate = yield call(getI18n, 'askOpenAll')
    const msgAskOpenAll = msgAskOpenAllTemplate.replace('%bkmarkCount%', urls.length)
    // `window.confirm()` doesn't work as chrome will force close popup
    // should use ui redux to handle and use loop to wait for user confirm/cancel
  }
  */

  switch (payload.openIn) {
    case CST.OPEN_IN_TYPES.BACKGROUND_TAB:
      yield all(urls.map(createBackgroundTab))
      break
    case CST.OPEN_IN_TYPES.CURRENT_TAB:
      yield call(updateTab, {url: urls[0]})
      break
    case CST.OPEN_IN_TYPES.INCOGNITO_WINDOW:
      yield call(createWindow, {
        url: urls,
        incognito: true
      })
      break
    case CST.OPEN_IN_TYPES.NEW_TAB:
      yield all(urls.map(createActiveTab))
      break
    case CST.OPEN_IN_TYPES.NEW_WINDOW:
      yield call(createWindow, {
        url: urls,
        incognito: false
      })
      break
    default:
  }

  if (payload.isCloseBrowser) yield call(window.close)
}
