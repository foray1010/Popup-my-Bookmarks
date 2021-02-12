import * as R from 'ramda'
import { all, call, select } from 'redux-saga/effects'
import type { ActionType } from 'typesafe-actions'

import {
  createTab,
  createWindow,
  executeScript,
  getI18n,
  updateTab,
} from '../../../../../core/utils'
import { BOOKMARK_TYPES, OPEN_IN_TYPES, OPTIONS } from '../../../../constants'
import type { BookmarkInfo } from '../../../../types'
import type { RootState } from '../../../rootReducer'
import type * as bookmarkCreators from '../../actions'
import { getBookmarkInfo } from '../utils/getters'

function* getUrls(ids: Array<string>) {
  try {
    const bookmarkInfos: Array<BookmarkInfo> = yield all(
      ids.map((id) => call(getBookmarkInfo, id)),
    )

    const filteredBookmarkInfos = bookmarkInfos.filter(
      (bookmarkInfo) =>
        bookmarkInfo.isSimulated === false &&
        bookmarkInfo.type === BOOKMARK_TYPES.BOOKMARK,
    )
    return filteredBookmarkInfos.map((bookmarkInfo) => bookmarkInfo.url)
  } catch (err) {
    console.error(err)

    return []
  }
}

export function* openBookmarksInBrowser({
  payload,
}: ActionType<typeof bookmarkCreators.openBookmarksInBrowser>) {
  try {
    const { ids, openBookmarkProps } = payload

    const { options }: RootState = yield select(R.identity)

    const allUrls: Array<string> = yield call(getUrls, ids)
    if (!allUrls.length) return

    const bookmarkletUrls = allUrls.filter((x) => x.startsWith('javascript:'))
    const urls = allUrls.filter((x) => !x.startsWith('javascript:'))

    if (openBookmarkProps.isAllowBookmarklet && bookmarkletUrls.length > 0) {
      // @ts-ignore: seems type is wrong, tabId is nullable
      yield call(executeScript, null, {
        code: bookmarkletUrls[0],
      })
    }

    if (urls.length > 0) {
      if (urls.length > 5) {
        const msgAskOpenAllTemplate: string = yield call(getI18n, 'askOpenAll')
        const msgAskOpenAll = msgAskOpenAllTemplate.replace(
          '%bkmarkCount%',
          String(urls.length),
        )
        // `window.confirm()` doesn't work as chrome will force close popup
        // but worked again at least since chrome 73
        if (options[OPTIONS.WARN_OPEN_MANY] && !window.confirm(msgAskOpenAll))
          return
      }

      switch (openBookmarkProps.openIn) {
        case OPEN_IN_TYPES.BACKGROUND_TAB:
          yield all(urls.map((url) => call(createTab, { url, active: false })))
          break
        case OPEN_IN_TYPES.CURRENT_TAB:
          // @ts-ignore: doesn't work with overloaded function
          yield call(updateTab, { url: urls[0] })
          break
        case OPEN_IN_TYPES.INCOGNITO_WINDOW:
          yield call(createWindow, {
            url: urls,
            incognito: true,
          })
          break
        case OPEN_IN_TYPES.NEW_TAB:
          yield all(urls.map((url) => call(createTab, { url, active: true })))
          break
        case OPEN_IN_TYPES.NEW_WINDOW:
          yield call(createWindow, { url: urls })
          break
        default:
      }
    }

    if (openBookmarkProps.isCloseThisExtension) yield call(window.close)
  } catch (err) {
    console.error(err)
  }
}
