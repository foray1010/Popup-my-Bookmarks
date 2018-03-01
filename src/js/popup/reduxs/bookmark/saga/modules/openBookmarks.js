// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {createTab, createWindow} from '../../../../../common/utils'
import * as CST from '../../../../constants'
import {getBookmarkInfo} from '../utils/getters'

type Ids = $ReadOnlyArray<string>
function* getUrls(ids: Ids): Saga<$ReadOnlyArray<string>> {
  const bookmarkInfos = yield all(R.map(getBookmarkInfo, ids))

  return R.compose(R.map(R.prop('url')), R.filter(R.propEq('type', CST.TYPE_BOOKMARK)))(
    bookmarkInfos
  )
}

type Payload = {|
  ids: Ids,
  params: {|
    openInBackground: boolean,
    openInIncognitoWindow: boolean,
    openInNewWindow: boolean,
    warnWhenOpenMany: boolean
  |}
|}
export function* openBookmarks({
  ids,
  params: {
    openInIncognitoWindow = false,
    openInNewWindow = false,
    openInBackground = false
    // warnWhenOpenMany = false
  }
}: Payload): Saga<void> {
  // logic check
  if (openInIncognitoWindow && !openInNewWindow) {
    throw new Error('incognito window must be new window')
  }
  if (openInBackground && openInNewWindow) throw new Error('cannot open in background window')

  const urls = yield call(getUrls, ids)

  /*
  if (urls.length > 5) {
    const msgAskOpenAllTemplate = yield call(getI18n, 'askOpenAll')
    const msgAskOpenAll = msgAskOpenAllTemplate.replace('%bkmarkCount%', urls.length)
    // `window.confirm()` doesn't work as chrome will force close popup
    // should use ui redux to handle and use loop to wait for user confirm/cancel
  }
  */

  if (openInNewWindow) {
    yield call(createWindow, {
      url: urls,
      incognito: openInIncognitoWindow
    })
  } else {
    yield all(urls.map((url) => call(createTab, {url, active: !openInBackground})))
  }
}
