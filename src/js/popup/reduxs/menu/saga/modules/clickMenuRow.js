// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../../bookmark/actions'
import {getBookmarkInfo, getBookmarkTree} from '../../../bookmark/saga/utils/getters'

type Payload = {|
  rowName: string
|}
export function* clickMenuRow({rowName}: Payload): Saga<void> {
  const {menu, options} = yield select(R.pick(['menu', 'options']))

  const targetBookmarkInfo = yield call(getBookmarkInfo, menu.targetId)

  switch (rowName) {
    case CST.MENU_ADD_PAGE:
      yield put(
        bookmarkCreators.addCurrentPage(
          targetBookmarkInfo.parentId,
          targetBookmarkInfo.storageIndex + 1
        )
      )
      break

    case CST.MENU_ADD_SEPARATOR:
      yield put(
        bookmarkCreators.addSeparator(
          targetBookmarkInfo.parentId,
          targetBookmarkInfo.storageIndex + 1
        )
      )
      break

    case CST.MENU_COPY:
      yield put(bookmarkCreators.copyBookmark(targetBookmarkInfo.id))
      break

    case CST.MENU_CUT:
      yield put(bookmarkCreators.cutBookmark(targetBookmarkInfo.id))
      break

    case CST.MENU_DEL:
      yield put(bookmarkCreators.deleteBookmark(targetBookmarkInfo.id))
      break

    case CST.MENU_OPEN_ALL:
    case CST.MENU_OPEN_ALL_IN_I:
    case CST.MENU_OPEN_ALL_IN_N: {
      const targetBookmarkTree = yield call(getBookmarkTree, targetBookmarkInfo.id)
      const ids = R.compose(R.map(R.prop('id')), R.prop('children'))(targetBookmarkTree)
      yield put(
        bookmarkCreators.openBookmarks(ids, {
          openInIncognitoWindow: rowName === CST.MENU_OPEN_ALL_IN_N,
          openInNewWindow: rowName === CST.MENU_OPEN_ALL_IN_I || rowName === CST.MENU_OPEN_ALL_IN_N,
          warnWhenOpenMany: options.warnOpenMany
        })
      )
      break
    }

    case CST.MENU_OPEN_IN_B:
    case CST.MENU_OPEN_IN_I:
    case CST.MENU_OPEN_IN_N:
      yield put(
        bookmarkCreators.openBookmarks([targetBookmarkInfo.id], {
          openInBackground: rowName === CST.MENU_OPEN_IN_B,
          openInIncognitoWindow: rowName === CST.MENU_OPEN_IN_N,
          openInNewWindow: rowName === CST.MENU_OPEN_IN_I || rowName === CST.MENU_OPEN_IN_N,
          warnWhenOpenMany: options.warnOpenMany
        })
      )
      break

    case CST.MENU_SORT_BY_NAME:
      yield put(bookmarkCreators.sortBookmarksByName(targetBookmarkInfo.parentId))
      break

    default:
  }
}
