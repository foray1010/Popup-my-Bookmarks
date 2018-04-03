// @flow

import * as R from 'ramda'
import type {Saga} from 'redux-saga'
import {call, put, select} from 'redux-saga/effects'

import * as CST from '../../../../constants'
import {bookmarkCreators} from '../../../bookmark/actions'
import {getBookmarkInfo, getBookmarkTree} from '../../../bookmark/saga/utils/getters'
import {editorCreators} from '../../../editor/actions'

type Payload = {|
  rowName: string
|}
export function* clickMenuRow({rowName}: Payload): Saga<void> {
  const {menu} = yield select(R.pick(['menu']))

  const targetBookmarkInfo = yield call(getBookmarkInfo, menu.targetId)

  switch (rowName) {
    case CST.MENU_ADD_FOLDER:
      yield put(
        editorCreators.createFolderInEditor(menu.targetId, {
          positionLeft: menu.targetLeft,
          positionTop: menu.targetTop
        })
      )
      break

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

    case CST.MENU_EDIT:
    case CST.MENU_RENAME:
      yield put(
        editorCreators.openEditor(menu.targetId, {
          positionLeft: menu.targetLeft,
          positionTop: menu.targetTop
        })
      )
      break

    case CST.MENU_OPEN_ALL:
    case CST.MENU_OPEN_ALL_IN_I:
    case CST.MENU_OPEN_ALL_IN_N: {
      const targetBookmarkTree = yield call(getBookmarkTree, targetBookmarkInfo.id)
      const ids = R.compose(R.pluck('id'), R.prop('children'))(targetBookmarkTree)

      const mapping = {
        [CST.MENU_OPEN_ALL]: CST.OPEN_IN_TYPES.BACKGROUND_TAB,
        [CST.MENU_OPEN_ALL_IN_I]: CST.OPEN_IN_TYPES.INCOGNITO_WINDOW,
        [CST.MENU_OPEN_ALL_IN_N]: CST.OPEN_IN_TYPES.NEW_WINDOW
      }
      yield put(bookmarkCreators.openBookmarksInBrowser(ids, mapping[rowName], true))
      break
    }

    case CST.MENU_OPEN_IN_B:
    case CST.MENU_OPEN_IN_I:
    case CST.MENU_OPEN_IN_N: {
      const mapping = {
        [CST.MENU_OPEN_IN_B]: CST.OPEN_IN_TYPES.BACKGROUND_TAB,
        [CST.MENU_OPEN_IN_I]: CST.OPEN_IN_TYPES.INCOGNITO_WINDOW,
        [CST.MENU_OPEN_IN_N]: CST.OPEN_IN_TYPES.NEW_WINDOW
      }
      yield put(
        bookmarkCreators.openBookmarksInBrowser([targetBookmarkInfo.id], mapping[rowName], true)
      )
      break
    }

    case CST.MENU_PASTE:
      yield put(
        bookmarkCreators.pasteBookmark(
          targetBookmarkInfo.parentId,
          targetBookmarkInfo.storageIndex + 1
        )
      )
      break

    case CST.MENU_SORT_BY_NAME:
      yield put(bookmarkCreators.sortBookmarksByName(targetBookmarkInfo.parentId))
      break

    default:
  }
}
