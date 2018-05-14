// @flow strict

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {createTab, createWindow, updateTab} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import type {OpenIn} from '../../../../types'
import {getBookmarkInfo} from '../utils/getters'

const _createTabGenerator = (active: boolean) => (url: string) => call(createTab, {url, active})
const createActiveTab = _createTabGenerator(true)
const createBackgroundTab = _createTabGenerator(false)

type Ids = $ReadOnlyArray<string>
function* getUrls(ids: Ids): Saga<$ReadOnlyArray<string>> {
  const bookmarkInfos = yield all(R.map(getBookmarkInfo, ids))
  return R.compose(
    R.pluck('url'),
    R.filter(R.both(R.propEq('isSimulated', false), R.propEq('type', CST.TYPE_BOOKMARK)))
  )(bookmarkInfos)
}

type Payload = {|
  ids: Ids,
  isCloseBrowser: boolean,
  openIn: OpenIn
|}
export function* openBookmarksInBrowser({ids, isCloseBrowser, openIn}: Payload): Saga<void> {
  const urls = yield call(getUrls, ids)
  if (!urls.length) return

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

  if (isCloseBrowser) yield call(window.close)
}
