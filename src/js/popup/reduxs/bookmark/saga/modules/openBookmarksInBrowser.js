// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {createTab, createWindow, updateTab} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import type {OpenIn} from '../../../../types'
import {getBookmarkInfo} from '../utils/getters'

type Ids = $ReadOnlyArray<string>
function* getUrls(ids: Ids): Saga<$ReadOnlyArray<string>> {
  const bookmarkInfos = yield all(R.map(getBookmarkInfo, ids))

  return R.compose(R.pluck('url'), R.filter(R.propEq('type', CST.TYPE_BOOKMARK)))(bookmarkInfos)
}

type Payload = {|
  ids: Ids,
  openIn: OpenIn
|}
export function* openBookmarksInBrowser({ids, openIn}: Payload): Saga<void> {
  const urls = yield call(getUrls, ids)

  /*
  if (urls.length > 5) {
    const msgAskOpenAllTemplate = yield call(getI18n, 'askOpenAll')
    const msgAskOpenAll = msgAskOpenAllTemplate.replace('%bkmarkCount%', urls.length)
    // `window.confirm()` doesn't work as chrome will force close popup
    // should use ui redux to handle and use loop to wait for user confirm/cancel
  }
  */

  switch (openIn) {
    case CST.OPEN_IN_TYPES.BACKGROUND_TAB:
      yield all(urls.map((url) => call(createTab, {url, active: false})))
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
    case CST.OPEN_IN_TYPES.NEW_WINDOW:
      yield call(createWindow, {
        url: urls,
        incognito: false
      })
      break
    default:
  }
}
