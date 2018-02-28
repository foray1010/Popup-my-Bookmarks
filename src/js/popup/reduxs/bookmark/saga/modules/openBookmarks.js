// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {all, call} from 'redux-saga/effects'

import {createTab, createWindow} from '../../../../../common/functions'
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
    isIncognito: boolean,
    isNewWindow: boolean,
    isWarnWhenOpenMany: boolean
  |}
|}
export function* openBookmarks({ids, params}: Payload): Saga<void> {
  try {
    const urls = yield call(getUrls, ids)

    /*
    if (urls.length > 5) {
      const msgAskOpenAllTemplate = yield call(getI18n, 'askOpenAll')
      const msgAskOpenAll = msgAskOpenAllTemplate.replace('%bkmarkCount%', urls.length)
      // `window.confirm()` doesn't work as chrome will force close popup
      // should use ui redux to handle and use loop to wait for user confirm/cancel
    }
    */

    if (params.isNewWindow) {
      yield call(createWindow, {
        url: urls,
        incognito: params.isIncognito
      })
    } else {
      yield all(urls.map((url) => call(createTab, {url, active: false})))
    }
  } catch (err) {
    console.error(err)
  }
}
